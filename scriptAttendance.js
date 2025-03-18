export const fetchJsonSenate = async () => {
    try {
        const response = await fetch('./senateData.json');
        const data = await response.json();
        const members = data.results[0].members;
        const statisticKeySenate = {
            senate: {
                statistics: {
                    counts: {
                        D: 0,
                        R: 0,
                        ID: 0
                    }
                }
            }
        };
        members.forEach(member => {
            if (member.party === 'D') {
                statisticKeySenate.senate.statistics.counts.D++;
            } else if (member.party === 'R') {
                statisticKeySenate.senate.statistics.counts.R++;
            } else {
                statisticKeySenate.senate.statistics.counts.ID++;
            }
        });

        const percentageVotes = members.map(member => ({
            votePercentage: member.votes_with_party_pct,
            party: member.party
        }));
        const counts = [
            {
                numberRepsDem: statisticKeySenate.senate.statistics.counts.D,
                numberRepsRep: statisticKeySenate.senate.statistics.counts.R,
                numberRepsInd: statisticKeySenate.senate.statistics.counts.ID,
                numberTotal: statisticKeySenate.senate.statistics.counts.D +
                    statisticKeySenate.senate.statistics.counts.R +
                    statisticKeySenate.senate.statistics.counts.ID
            },
        ];
        const memberEngagement = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            missedVotes: member.missed_votes,
            percentMissed: member.missed_votes_pct
        }));

        const nameAndUrl = members.map(member => ({
            name: member.first_name + ' ' + member.last_name,
            url: member.url
        }));
        countVotes(percentageVotes);
        makeStatisticsRowGlance(counts);
        makeStatisticsLeast(memberEngagement);
        makeStatisticsMost(memberEngagement);
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
    const tableBody = document.querySelector('.table-glance-body');
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

export const makeStatisticsRowGlanceHouse = (results) => {
    const numbers = results[0];
    const tableBody = document.querySelector('.table-glance-body-house');
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


export const countVotes = (percentageVotes) => {
    const democrats = percentageVotes.filter(senator => senator.party === 'D');
    const totalVotesDemocratic = Math.ceil((democrats.reduce((sum, senator) => sum + senator.votePercentage, 0)) / democrats.length);

    const republicans = percentageVotes.filter(senator => senator.party === 'R');
    const totalVotesRepublican = Math.ceil(republicans.reduce((sum, senator) => sum + senator.votePercentage, 0) / republicans.length);

    const independents = percentageVotes.filter(senator => senator.party === 'ID');
    const totalVotesIndependent = Math.ceil(independents.reduce((sum, senator) => sum + senator.votePercentage, 0) / independents.length);

    const totalVotesAllParties = Math.ceil((totalVotesDemocratic + totalVotesRepublican + totalVotesIndependent) / 3);

    const arrayResults = [
        {
            totalVotesDemocratic, totalVotesRepublican, totalVotesIndependent, totalVotesAllParties
        }
    ];

}

export const makeStatisticsLeast = (data) => {
    const descending = data.sort((a, b) => b.percentMissed - a.percentMissed);
    const tenLeast = descending.slice(0, 10);
    const tableBody = document.querySelector('.table-least-body');

    for (let i = 0; i < tenLeast.length; i++) {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');
        cell1.textContent = tenLeast[i].name;
        cell1.classList.add('names');
        cell2.textContent = tenLeast[i].missedVotes;
        cell3.textContent = tenLeast[i].percentMissed;
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tableBody.appendChild(row);
    }


}

export const makeStatisticsMost = (data) => {
    const ascending = data.sort((a, b) => a.percentMissed - b.percentMissed);
    const tenMost = ascending.slice(0, 10);
    const tableBody = document.querySelector('.table-most-body');

    for (let i = 0; i < tenMost.length; i++) {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');
        const cell3 = document.createElement('td');
        cell1.textContent = tenMost[i].name;
        cell1.classList.add('names');
        cell2.textContent = tenMost[i].missedVotes;
        cell3.textContent = tenMost[i].percentMissed;
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
        if (nameInfo && nameInfo.url) {
            link.href = nameInfo.url;
            cell.textContent = '';
            cell.appendChild(link);
        } else {
            console.warn('url not found');
        }
    })
}

export const displayMembers = () => {
    const urlParameter = new URLSearchParams(window.location.search);
    const chamber = urlParameter.get('chamber');

    const glanceContainerSenate = document.querySelector('.glance-container-senate');
    const glanceContainerHouse = document.querySelector('.glance-container-house');

    const finalColoumn = document.querySelector('.finalColoumnHouse');

    if (chamber === 'house') {
        glanceContainerHouse.style.display = 'block',
            finalColoumn.style.display = 'none';
    } else {
        glanceContainerHouse.style.display = 'none';
    }
    if (chamber === 'senate') {
        glanceContainerSenate.style.display = 'block',
            finalColoumn.style.display = 'block';
    } else {
        glanceContainerSenate.style.display = 'none';
    }
}

displayMembers();
fetchJsonHouse();
fetchJsonSenate();