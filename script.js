const searchBar = document.getElementById('search-bar');
const doctorListContainer = document.getElementById('doctor-list-container');
const consultationRadios = document.querySelectorAll('input[name="consultation"]');
const specialtyCheckboxes = document.querySelectorAll('input[name="specialty"]');
let allDoctors = [];

async function fetchDoctorsAndDisplay() {
    try {
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        const data = await response.json();
        allDoctors = data;
        renderDoctors(allDoctors); // Initial rendering of all doctors
    } catch (error) {
        console.error('Fetch Error:', error);
        doctorListContainer.innerHTML = '<p>Failed to load doctors.</p>';
    }
}

function renderDoctors(doctors) {
    doctorListContainer.innerHTML = '';
    if (doctors.length === 0) {
        doctorListContainer.innerHTML = '<p>No doctors found.</p>';
        return;
    }
    doctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.classList.add('doctor-card');
        const displayedName = doctor.name.startsWith('Dr. ') ? doctor.name.substring(4).trim() : doctor.name;
        let specialtyText = 'No Specialty Listed';
        if (doctor.specialty) {
            if (Array.isArray(doctor.specialty)) {
                specialtyText = doctor.specialty.join(', ');
            } else if (typeof doctor.specialty === 'object' && doctor.specialty.name) {
                specialtyText = doctor.specialty.name;
            } else if (typeof doctor.specialty === 'string') {
                specialtyText = doctor.specialty;
            }
        }
        doctorCard.innerHTML = `
            <img src="${doctor.image || 'placeholder-image.png'}" alt="${doctor.name}" class="doctor-image">
            <div class="doctor-info">
                <h3>${displayedName}</h3>
                <p>${specialtyText}</p>
                <p>${doctor.experience} years exp.</p>
                <p>${doctor.clinic}</p>
                <p>₹${doctor.fees}</p>
            </div>
            <div class="doctor-actions">
                <button>Book Appointment</button>
            </div>
        `;
        doctorListContainer.appendChild(doctorCard); // Line 52 (likely)
    });
}

function applyFiltersAndSearch() {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedConsultation = Array.from(consultationRadios).find(radio => radio.checked).value;
    const selectedSpecialties = Array.from(specialtyCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value.toLowerCase());

    let filteredDoctors = allDoctors;

    // Filter by consultation type
    if (selectedConsultation !== 'All') {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.consultation_type === selectedConsultation);
    }

    // Filter by specialties
    if (selectedSpecialties.length > 0) {
        filteredDoctors = filteredDoctors.filter(doctor =>
            doctor.specialty.some(spec => selectedSpecialties.includes(spec.toLowerCase()))
        );
    }

    // Search by doctor name (after "Dr.")
    if (searchTerm) {
        filteredDoctors = filteredDoctors.filter(doctor => {
            const nameWithoutDr = doctor.name.toLowerCase().startsWith('dr. ') ?
                doctor.name.toLowerCase().substring(4) :
                doctor.name.toLowerCase();
            return nameWithoutDr.startsWith(searchTerm);
        });
    }

    renderDoctors(filteredDoctors);
}

// Event listeners
searchBar.addEventListener('input', applyFiltersAndSearch);
consultationRadios.forEach(radio => radio.addEventListener('change', applyFiltersAndSearch));
specialtyCheckboxes.forEach(checkbox => checkbox.addEventListener('change', applyFiltersAndSearch));

// Fetch and initially display doctors
fetchDoctorsAndDisplay();