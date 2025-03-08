export const fetchJsonHouse = async () => {
    try {
        const response = await fetch('./HouseData.json');
        const data = await response.json();
        const members = data[0].results[0].members;
        const selectMember = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            state: member.state,
            party: member.party,
            years: (parseInt(member.begin_date) - parseInt(member.end_date)) * -1
        }));

        if (Array.isArray(members)) {
            makeMemberRowsHouse(selectMember);
        } else {
            console.error('No Members.');
        }
    } catch (error) {
        console.error(error);
    }
};

export const fetchJsonSenate = async () => {
    try {
        const response = await fetch('./SenateData.json');
        const data = await response.json();
        const members = data[0].results[0].members;
        const selectMember = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            state: member.state,
            party: member.party,
            years: member.seniority,
            percVotes: member.votes_with_party_pct
        }));
        if (Array.isArray(members)) {
            makeMemberRowsSenate(selectMember);
        } else {
            console.error('No members found.');
        }
    } catch (error) {
        console.error(error);
    }
};

export const createAnchorsHouse = (senatorData) => {
    const senatorNameCells = document.querySelectorAll('.house-senator-name');

    senatorNameCells.forEach(cell => {
        const senatorName = cell.textContent.trim();
        const senatorInfo = senatorData.find(senator => senator.Name === senatorName);

        const link = document.createElement('a');
        link.textContent = senatorName;
        link.href = senatorInfo.api_uri;
        cell.textContent = '';
        cell.appendChild(link);
    })
};

export const makeMemberRowsHouse = (data, partyFilter, stateFilter) => {
    const tableBody = document.querySelector('#house-table-body');

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        console.log(item);

        Object.entries(item).forEach(([key, value], valueIndex) => {
            const cell = document.createElement('td');
            if (key === 'name') {
                cell.classList.add('house-senator-name');
            }
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    createAnchorsHouse();
};

export const createAnchorsSenate = (senatorData) => {
    const senatorNameCells = document.querySelectorAll('.senate-senator-name');

    senatorNameCells.forEach(cell => {
        const senatorName = cell.textContent.trim();
        const senatorInfo = senatorData.find(senator => senator.name === senatorName);

        const link = document.createElement('a');
        link.textContent = senatorName;
        link.href = senatorInfo.url;
        cell.textContent = '';
        cell.appendChild(link);
    })
};

export const makeMemberRowsSenate = (data, partyFilter, stateFilter) => {
    const tableBody = document.querySelector('#senate-table-body');
    const filteredData = data.filter(item => {
        const partyMatch = !partyFilter || item.party === partyFilter;
        const stateMatch = !stateFilter || item.state === stateFilter;
        return partyMatch && stateMatch;
    })
    filteredData.forEach((item, index) => {
        const row = document.createElement("tr");

        Object.entries(item).forEach(([key, value], valueIndex) => {
            const cell = document.createElement("td");
            if (key === 'name') {
                cell.classList.add('senate-senator-name')
            }
            const link = document.createElement('a');
            link.textContent = value;
            cell.innerHTML = '';
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    createAnchorsSenate(filteredData);
};

export const buildStateMenu = async () => {
    try {
        const response = await fetch('states.json');
        const states = await response.json();
        const selectElement = document.querySelector('#select-state');
        const defaultOption = document.createElement('option');

        defaultOption.value = '';
        defaultOption.textContent = 'Select a State:';
        selectElement.appendChild(defaultOption);

        for (const abbreviation in states) {
            if (states.hasOwnProperty(abbreviation)) {
                const stateName = states[abbreviation];
                const option = document.createElement('option');
                option.value = abbreviation;
                option.textContent = stateName;
                selectElement.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Error fetching');
    }
}

buildStateMenu();
fetchJsonHouse();
fetchJsonSenate();