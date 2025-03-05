export const fetchJsonHouse = async () => {
    try {
        const response = await fetch('./HouseData.json');
        const data = await response.json();
        const members = data[0].results[0].members;
        const selectMember = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            state: member.state,
            party: member.party,
            years: (parseInt(member.begin_date) - parseInt(member.end_date)) * -1,
            percVotes: null
        }));


        if (Array.isArray(members)) {
            makeMemberRowsHouse(selectMember);
        } else {
            console.error('No Members.');
        }
    } catch (error) {
        console.error('Error');
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
            years: null,
            percVotes: member.votes_with_party_pct
        }));

        if (Array.isArray(members)) {
            makeMemberRowsSenate(selectMember);
        } else {
            console.error('No members found.');
        }
    } catch (error) {
        console.error('Error');
    }
};

export const makeMemberRowsHouse = (data) => {
    const tableBody = document.querySelector('#house-table-body');
    data.forEach((item, index) => {
        const row = document.createElement("tr");

        Object.values(item).forEach((value, valueIndex) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
};

export const makeMemberRowsSenate = (data) => {
    const tableBody = document.querySelector('#senate-table-body');
    data.forEach((item, index) => {
        const row = document.createElement("tr");

        Object.values(item).forEach((value, valueIndex) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
};

fetchJsonHouse();
fetchJsonSenate();