export const fetchJsonHouse = async () => {
    const response = await fetch('./HouseData.json');
    const data = await response.json();
    document.querySelector('.house-table-body').innerHTML = makeMemberRows(data);
};

export const makeMemberRows = (data) => {
    const tableBody = document.querySelector('house-table-body');
    data.forEach(item => {
        const row = document.createElement("tr");

        Object.values(item).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

fetchJsonHouse();