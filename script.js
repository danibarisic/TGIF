
let storedSenateMembers = null;
let storedHouseMembers = null;

export const fetchJsonHouse = async (partyFilters = [], stateFilter = '') => {
    try {
        if (!storedHouseMembers) {
            const response = await fetch('./houseData.json');
            const data = await response.json();
            const members = data.results[0].members;
            storedHouseMembers = members.map(member => ({
                name: member.first_name + ' ' + member.last_name,
                state: member.state,
                party: member.party,
                years: (parseInt(member.end_date) - parseInt(member.begin_date)),
                url: member.api_uri
            }));
        }

        filterAndDisplayHouse(storedHouseMembers, partyFilters, stateFilter);

    } catch (error) {
        console.error(error);
    }
};

export const fetchJsonSenate = async (partyFilters = [], stateFilter = '') => {
    try {
        if (!storedSenateMembers) {
            const response = await fetch('./senateData.json');
            const data = await response.json();
            const members = data.results[0].members;
            storedSenateMembers = members.map(member => ({
                name: member.first_name + ' ' + member.last_name,
                state: member.state,
                party: member.party,
                years: member.seniority,
                percVotes: member.votes_with_party_pct,
                url: member.url
            }));
        }
        filterAndDisplaySenate(storedSenateMembers, partyFilters, stateFilter);

    } catch (error) {
        console.error(error);
    }
};

// let storedSenateMembers = null;

const createAnchors = (senatorData, className) => {
    const names = document.querySelectorAll(`.${className}`);
    names.forEach(cell => {
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

const filterAndDisplayHouse = (members, partyFilters, stateFilter) => {
    let filteredMembers = members;
    if (partyFilters.length > 0) {
        filteredMembers = filteredMembers.filter(member => partyFilters.includes(member.party));
    }
    if (stateFilter) {
        filteredMembers = filteredMembers.filter(member => member.state === stateFilter);
    }
    makeMemberRows(filteredMembers, partyFilters, stateFilter, '#house-table-body', 'house-senator-name');
};

const filterAndDisplaySenate = (members, partyFilters, stateFilter) => {
    let filteredMembers = members;
    if (partyFilters.length > 0) {
        filteredMembers = filteredMembers.filter(member => partyFilters.includes(member.party));
    }
    if (stateFilter) {
        filteredMembers = filteredMembers.filter(member => member.state === stateFilter);
    }
    makeMemberRows(filteredMembers, partyFilters, stateFilter, '#senate-table-body', 'senate-senator-name');
};

const applyFilters = async () => {
    const partyFilters = Array.from(document.querySelectorAll('.partyFilterCheckbox:checked')).map(checkbox => checkbox.value);
    const stateFilter = document.getElementById('select-state').value;

    const urlParameter = new URLSearchParams(window.location.search);
    const chamber = urlParameter.get('chamber');

    if (chamber === 'senate') {
        if (storedSenateMembers) {
            filterAndDisplaySenate(storedSenateMembers, partyFilters, stateFilter);
        } else {
            await fetchJsonSenate(partyFilters, stateFilter);
        }
    } else {
        if (storedHouseMembers) {
            filterAndDisplayHouse(storedHouseMembers, partyFilters, stateFilter);
        } else {
            await fetchJsonHouse(partyFilters, stateFilter);
        }
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

// Displays containers and tables depending on search parameter.
export const displayMembers = () => {
    const urlParameter = new URLSearchParams(window.location.search);
    const chamber = urlParameter.get('chamber');

    const infoContainerSenate = document.getElementById('info-container-senate');
    const tableContainerSenate = document.querySelector('.table-container-senate');
    const infoContainerHouse = document.getElementById('info-container-house');
    const tableContainerHouse = document.querySelector('.table-container-house');

    if (infoContainerSenate) {
        infoContainerSenate.style.display = chamber === 'senate' ? 'block' : 'none';
    }
    if (tableContainerSenate) {
        tableContainerSenate.style.display = chamber === 'senate' ? 'block' : 'none';
    }
    if (infoContainerHouse) {
        infoContainerHouse.style.display = chamber === 'house' ? 'block' : 'none';
    }
    if (tableContainerHouse) {
        tableContainerHouse.style.display = chamber === 'house' ? 'block' : 'none';
    }
};

// Makes home link in navbar change colour when active.
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
    });
};

// Changes background colour a little darker on scroll to enhance contrast.
export const changeColourScroll = () => {
    const navBar = document.querySelector('.navigation-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            navBar.style.backgroundColor = 'rgb(240, 240, 240)';
        } else {
            navBar.style.backgroundColor = 'rgb(255, 255, 255)';
        }
    })
};

document.addEventListener('DOMContentLoaded', () => {
    const partyCheckboxes = document.querySelectorAll('.partyFilterCheckbox');
    const stateFilterSelect = document.getElementById('select-state');
    changeColourScroll();
    makeLinkActive();
    displayMembers();
    buildStateMenu();
    applyFilters();

    partyCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            applyFilters();
        });
    });
    stateFilterSelect.addEventListener('change', () => {
        applyFilters();
    });
});