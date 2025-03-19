//initializing an empty employees array as a global variable 
//establishing the location of the gallery div as a global variable

let employees = [];
const galleryDiv = document.getElementById('gallery');

//fetchData function will be used to fetch the random employee from the random user API
function fetchData() {
    fetch('https://randomuser.me/api/?results=12&nat=us,gb,ca,au,nz')
        .then(response => response.json())
        .then(data => {
            employees = data.results;
            displayEmployees(employees);
            searchFeature();
        })
        .catch(error => console.log('Error fetching data:', error));
}

fetchData();

//function used to temporarily test the return of the employee information
/* 
function displayEmployees(employeeData) {
    console.log('Employee data received:', employeeData);
} */


//displayEmployees will take the fetched data and display it in the html 
function displayEmployees(employeeData) {
    galleryDiv.innerHTML = '';

    employeeData.forEach(employee => {
        const html = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
        `;

        galleryDiv.insertAdjacentHTML('beforeend', html);
    });

    //card listener functionality for when an employee card is clicked
    cardListeners();
}

//adding event listeners to the employee cards
function cardListeners() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            displayModal(index);
        });
    });
}

//display for when a card is clicked
function displayModal(index) {

    //console.log('displayed index:', index)

    //closing any existing open modals
    closeModal();

    const employee = employees[index];

    //formatting the date becuase the natural format isn't reader-friendly
    const dob = new Date(employee.dob.date);
    const formattedDOB = `${(dob.getMonth() + 1).toString().padStart(2, '0')}/${dob.getDate().toString().padStart(2, '0')}/${dob.getFullYear()}`;
    

    //display the modal after click
    const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">City: ${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.cell}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${formattedDOB}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;

    //add the html to the body of the html
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    //add event listener to the close button for the modal 
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);

    document.getElementById('modal-prev').addEventListener('click', () => {
        closeModal();

        //calculating the previous index
        let prevIndex = index - 1;
        if (prevIndex < 0) {
            prevIndex = employees.length - 1;
        }

        displayModal(prevIndex);
    })

    document.getElementById('modal-next').addEventListener('click', () => {
        closeModal();

        //calculating the next index
        let nextIndex = index + 1;
        if (nextIndex >= employees.length) {
            nextIndex = 0;
        }

        displayModal(nextIndex);
    })
}

//function to close the modal when the X button is clicked
function closeModal() {
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.remove();
    }
}

function searchFeature() {
    const searchHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search employees...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit"> 
        </form>
    `;

    //adding the search container to the html
    document.querySelector('.search-container').insertAdjacentHTML('beforehand', searchHTML);

    const searchInput = document.getElementById('search-input');

    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        searchEmployees(searchTerm);
    });

    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.toLowerCase();
        searchEmployees(searchTerm);
    });
}

function searchEmployees(searchTerm) {
    //getting employee cards
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        const firstName = employees[index].name.first.toLowerCase();
        const lastName = employees[index].name.last.toLowerCase();
        const fullName = `${firstName} ${lastName}`;

        //checking for the search term
        if (fullName.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}