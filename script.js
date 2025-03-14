export const fetchJsonHouse = async (partyFilters = [], stateFilter = '') => {
    try {
        const response = await fetch('./houseData.json');
        const data = await response.json();
        const members = data.results[0].members;
        console.log(response);
        const selectMember = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            state: member.state,
            party: member.party,
            years: (parseInt(member.begin_date) - parseInt(member.end_date)) * -1,
            url: member.api_uri
        }));
        makeMemberRows(selectMember, partyFilters, stateFilter, '#house-table-body', 'house-senator-name');
    } catch (error) {
        console.error(error);
    }
};

export const fetchJsonSenate = async (partyFilters = [], stateFilter = '') => {
    try {
        const response = await fetch('./senateData.json');
        const data = await response.json();
        const members = data.results[0].members;
        const selectMember = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            state: member.state,
            party: member.party,
            years: member.seniority,
            percVotes: member.votes_with_party_pct,
            url: member.url
        }));
        makeMemberRows(selectMember, partyFilters, stateFilter, '#senate-table-body', 'senate-senator-name');
    } catch (error) {
        console.error(error);
    }
};

const createAnchors = (senatorData, className) => {
    const senatorNameCells = document.querySelectorAll(`.${className}`);
    senatorNameCells.forEach(cell => {
        const senatorName = cell.textContent.trim();
        const senatorInfo = senatorData.find(senator => senator.name === senatorName);
        const link = document.createElement('a');
        link.textContent = senatorName;
        link.classList.add('member-anchors');
        link.target = "_blank";
        link.href = senatorInfo.url;
        cell.textContent = '';
        cell.appendChild(link);
    });
};

const makeMemberRows = (data, partyFilter, stateFilter, tableBodySelector, className) => {
    const tableBody = document.querySelector(tableBodySelector);
    tableBody.innerHTML = '';

    const filteredData = data.filter(item => {
        const partyMatch = partyFilter.length === 0 || partyFilter.includes(item.party);
        const stateMatch = stateFilter.length === 0 || stateFilter.includes(item.state);
        return partyMatch && stateMatch;
    });

    filteredData.forEach((item) => {
        const row = document.createElement("tr");

        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'url') {
                const cell = document.createElement("td");
                if (key === 'name') {
                    cell.classList.add(className);
                }
                cell.textContent = value;
                row.appendChild(cell);
            }
        });
        tableBody.appendChild(row);
    });
    createAnchors(filteredData, className);
};

document.addEventListener('DOMContentLoaded', () => {
    const partyCheckboxes = document.querySelectorAll('.partyFilterCheckbox');
    const stateFilterSelect = document.getElementById('select-state');

    partyCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            applyFilters();
        });
    });
    stateFilterSelect.addEventListener('change', () => {
        applyFilters();
    });
});

const applyFilters = async () => {
    const partyFilters = Array.from(document.querySelectorAll('.partyFilterCheckbox:checked')).map(checkbox => checkbox.value);
    const stateFilter = document.getElementById('select-state').value;

    const urlParameter = new URLSearchParams(window.location.search);
    const chamber = urlParameter.get('chamber');

    if (chamber === 'senate') {
        await fetchJsonSenate(partyFilters, stateFilter);
    } else {
        await fetchJsonHouse(partyFilters, stateFilter);
    }
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

        Object.entries(states).forEach(([abbreviation, stateName]) => {
            const option = document.createElement('option');
            option.value = abbreviation;
            option.textContent = stateName;
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching');
    }
};

export const displayMembers = () => {
    const urlParameter = new URLSearchParams(window.location.search);
    const chamber = urlParameter.get('chamber');
    const informationHouse = document.getElementById('info-container-house');
    const informationSenate = document.getElementById('info-container-senate');
    const tableHouse = document.getElementsByClassName('table-container-house')[0];
    const tableSenate = document.getElementsByClassName('table-container-senate')[0];

    if (chamber === 'senate') {
        if (informationHouse) informationHouse.style.display = 'none';
        if (tableHouse) tableHouse.style.display = 'none';
        if (informationSenate) informationSenate.style.display = 'block';
        if (tableSenate) tableSenate.style.display = 'block';
    } else {
        if (informationSenate) informationSenate.style.display = 'none';
        if (tableSenate) tableSenate.style.display = 'none';
        if (informationHouse) informationHouse.style.display = 'block';
        if (tableHouse) tableHouse.style.display = 'block';
    }
}


export const makeLinkActive = () => {
    const currentPage = window.location.href;
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        if (currentPage === link.href) {
            link.classList.add('active');
            link.style.backgroundColor = 'rgb(222 222 222)';
        } else {
            link.classList.remove('active');
            link.style.backgroundColor = '';
        }
    })
}
document.addEventListener('DOMContentLoaded', () => {
    makeLinkActive();
})

displayMembers();
buildStateMenu();
applyFilters();