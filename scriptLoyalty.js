export const fetchJsonSenate = async () => {
    try {
        const response = await fetch('./senateData.json');
        const data = await response.json();
        const members = data.results[0].members;
        const selectMembers = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            partyVotes: (member.total_votes - member.missed_votes),
            percentOfVotes: member.votes_with_party_pct
        }))
        const ascending = selectMembers.sort((a, b) => b.percentOfVotes - a.percentOfVotes);
        const topTen = ascending.splice(0, 10);

        const descending = selectMembers.sort((a, b) => a.percentOfVotes - b.percentOfVotes);
        const bottomTen = descending.splice(0, 10);

        const nameAndUrl = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            url: member.url
        }));

        makeStatisticsLeast(bottomTen);
        makeStatisticsMost(topTen);
        createLinks(nameAndUrl);

    } catch (error) {
        console.error(error);
    }
};

export const fetchJsonHouse = async () => {
    try {
        const response = await fetch('./houseData.json');
        const data = await response.json();
        const members = data.results[0].members;

        let sumD = 0;
        let sumR = 0;
        let sumID = 0;
        members.forEach(senator => {
            if (senator.party === 'D') {
                sumD++;
            } else if (senator.party === 'R') {
                sumR++;
            } else {
                sumID++;
            }
        })
        const total = sumD + sumR + sumID;
        const results = [
            { sumD, sumR, sumID, total }
        ]

        makeStatisticsRowGlanceHouse(results);

    } catch (error) {
        console.error(error);
    }
}

export const makeStatisticsRowGlance = (data) => {
    const tableBody = document.querySelector('.loyalty-glance-body');
    const votesData = [
        ['totalVotesDemocratic', 89],
        ['totalVotesRepublican', 97],
        ['totalVotesIndependent', 86],
        ['totalVotesAllParties', 91],
    ];

    const repsData = [
        ['numberRepsDem', 46],
        ['numberRepsRep', 54],
        ['numberRepsInd', 2],
        ['numberTotal', 102],
    ];

    const headers = ['Democrats', 'Republicans', 'Independents', 'Total'];

    for (let i = 0; i < votesData.length; i++) {
        const votesPair = votesData[i];
        const repsPair = repsData[i];

        const row = tableBody.insertRow();
        const header = headers[i];
        const headerCell = document.createElement('th');
        headerCell.textContent = header;
        row.appendChild(headerCell);

        const cell1 = row.insertCell();
        const cell2 = row.insertCell();

        cell1.textContent = `${votesPair[1]}`;
        cell2.textContent = `${repsPair[1]}`;
    }
}
makeStatisticsRowGlance();

export const makeStatisticsRowGlanceHouse = (results) => {
    const numbers = results[0];
    const tableBody = document.querySelector('.table-glance-body');
    const headers = {
        sumD: 'Democrats',
        sumR: 'Republicans',
        sumID: 'Independents',
        total: 'Total'
    }

    for (const key in numbers) {
        const row = tableBody.insertRow();
        const header = headers[key];
        const headerCell = document.createElement('th');
        headerCell.textContent = header;
        row.appendChild(headerCell);
        const cell = row.insertCell();
        cell.textContent = numbers[key];
    }
}

export const makeStatisticsLeast = (data) => {
    const tableBody = document.querySelector('.table-least-body-loyalty');
    tableBody.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');
        cell1.textContent = data[i].name;
        cell1.classList.add('names');
        cell2.textContent = data[i].partyVotes;
        cell3.textContent = data[i].percentOfVotes;
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tableBody.appendChild(row);
    }
}

export const makeStatisticsMost = (data) => {
    const tableBody = document.querySelector('.table-most-body-loyalty');
    tableBody.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');
        cell1.textContent = data[i].name;
        cell1.classList.add('names');
        cell2.textContent = data[i].partyVotes;
        cell3.textContent = data[i].percentOfVotes;
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tableBody.appendChild(row);
    }
}

export const createLinks = (data) => {
    const nameCell = document.querySelectorAll('.names');
    nameCell.forEach(cell => {
        const name = cell.textContent.trim();
        const nameInfo = data.find(senator => senator.name === name);
        const link = document.createElement('a');
        link.textContent = name;
        link.target = '_blank';
        link.classList.add('statistic-member-links');
        link.href = nameInfo.url;
        cell.textContent = '';
        cell.appendChild(link);
    })
}

export const displayMembers = () => {
    const urlParameter = new URLSearchParams(window.location.search);
    const chamber = urlParameter.get('chamber');

    const loyaltyGlanceSenate = document.querySelector('.loyalty-glance-senate');
    const loyaltyGlanceHouse = document.querySelector('.loyalty-glance-house');

    if (chamber === 'house') {
        loyaltyGlanceHouse.style.display = 'block';
    } else {
        loyaltyGlanceHouse.style.display = 'none';
    }
    if (chamber === 'senate') {
        loyaltyGlanceSenate.style.display = 'block';
    } else {
        loyaltyGlanceSenate.style.display = 'none';
    }
}

displayMembers();
fetchJsonHouse();
fetchJsonSenate();