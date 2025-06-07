// Configuration - Update these with your backend API details
const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your actual backend URL

// Utility function for making API requests
async function makeApiRequest(endpoint, method, data = null) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`API request error to ${endpoint}:`, error);
        throw error;
    }
}

function initPilgrimRegistration() {
    const form = document.querySelector('.register-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect form data using exact field names from HTML
        const formData = {
            Name: form.fullname.value,  
            Age: form.age.value,        
            Gender: form.gender.value,  
            Contact_Number: form.phone.value,  
            Email_Address: form.email.value,   
            Address: form.address.value,  
            Emergency_Contact: form.emergency_name.value,  
            Emergency_Contact_Phone: form.emergency_number.value,  
            Medical_Condition: form.medical.value,  
        };

        try {
            // UI feedback while processing
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Registering...';

            // Backend integration point - adjust endpoint as needed
            const response = await makeApiRequest('pilgrims/register', 'POST', formData);
            
            // Success handling
            alert(`Registration successful! Your ID: ${response.id || 'N/A'}`);
            form.reset();
            
            // Optional: Redirect or update UI
            // window.location.href = 'success.html';
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Register';
            }
        }
    });
}

// ==================== INCIDENT REPORTING FORM ====================
function initIncidentReporting() {
    const form = document.querySelector('.incident-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect form data using exact field names from HTML
        const formData = {
            Incident_Type: form.incidentType.value,
            Location: form.location.value,
            Date_Time: new Date(form.dateTime.value).toISOString(),
            Reported_By: form.reportedBy.value,
            Status: form.status.value,
            Assigned_Authority: form.assignedAuthority.value
        };

        try {
            // UI feedback while processing
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // Backend integration point - adjust endpoint as needed
            const response = await makeApiRequest('incidents/report', 'POST', formData);
            
            // Success handling
            alert(`Incident reported successfully! Case ID: ${response.caseId || 'N/A'}`);
            form.reset();
            
        } catch (error) {
            console.error('Incident reporting error:', error);
            alert('Failed to submit incident report. Please try again.');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Report';
            }
        }
    });
}

// ==================== LOST AND FOUND FORM ====================
function initLostAndFound() {
    const form = document.querySelector('.lost-found-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect form data using exact field names from HTML
        const formData = {
            Reported_By: form.Reported_By.value,
            Description: form.Description.value,
            Date_Time: new Date(form.Date_Time.value).toISOString(),  
            Location: form.Location.value,
            Availability: form.Availability.checked,  
            Claim_Status: form.Claim_Status.value || null  
        };

        try {
            // UI feedback while processing
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';

            // Backend integration point - adjust endpoint as needed
            const response = await makeApiRequest('lostfound/report', 'POST', formData);
            
            // Success handling
            alert(`Report submitted successfully! Reference ID: ${response.referenceId || 'N/A'}`);
            form.reset();
            
        } catch (error) {
            console.error('Lost & Found reporting error:', error);
            alert('Failed to submit report. Please try again.');
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Report';
            }
        }
    });
}

function initFireStations() {
    const grid = document.querySelector('.booth-grid');
    if (!grid) return;

    // Fetch fire stations data from the backend API
    fetchFireStationsData()
        .then(data => {
            // Clear any existing content in the grid
            grid.innerHTML = '';

            // Generate and display booth cards dynamically for each fire station
            data.forEach(station => {
                const card = document.createElement('div');
                card.className = 'booth-card';

                card.innerHTML = `
                    <h4>${station.Fire_Station_Name}</h4>
                    <p><strong>Location:</strong> ${station.Location}</p>
                    <p><strong>Emergency Contact:</strong> ${station.Contact}</p>
                    <p><strong>Fire Trucks Available:</strong> ${station.Number_of_trucks}</p>`;

                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching fire stations:', error);
            alert('Failed to load fire stations. Please try again.');
        });
}

async function fetchFireStationsData() {
    return makeApiRequest('firestations', 'GET');
}


// ==================== INITIALIZE ALL FORMS ====================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize the components that exist on the current page
    initPilgrimRegistration();
    initIncidentReporting();
    initLostAndFound();
    initFireStations();
    initAccommodationData();
    // Only try to initialize healthcare data if relevant elements exist
    const healthcareGrid = document.querySelector('.healthcare-grid');
    if (healthcareGrid) {
        initHealthcareData();
    }
    
    // Only try to initialize transport data if relevant elements exist
    const transportGrid = document.querySelector('.transport-grid');
    if (transportGrid) {
        loadTransportData();
    }
});

async function fetchHealthcareData() {
    return makeApiRequest('healthcare-data', 'GET');
}

async function initHealthcareData() {
    try {
        const data = await fetchHealthcareData();
        console.log("Full healthcare response:", data);
        if (!data) return;

        const hospitalGrid = document.querySelector('.healthcare-grid');
        const doctorGrid = document.querySelector('.doctor-grid');
        const emergencyGrid = document.querySelector('.emergency-grid');

        // Make sure the required elements exist before trying to update them
        if (!hospitalGrid || !doctorGrid || !emergencyGrid) {
            console.warn('Some healthcare grid elements not found on page');
            return;
        }

        // Clear existing content
        hospitalGrid.innerHTML = '';
        doctorGrid.innerHTML = '';
        emergencyGrid.innerHTML = '';

        // Hospitals
        data.hospitals.forEach(hospital => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${hospital.Hospital_Name}</h3>
                <p><strong>Location:</strong> ${hospital.Location}</p>
                <p><strong>Available Beds:</strong> ${hospital.Number_Of_Available_Beds ?? 'N/A'}</p>
                <p><strong>Contact:</strong> ${hospital.Emergency_Contact_Number}</p>
                <p><strong>Facilities:</strong> ${hospital.Facilities ?? 'N/A'}</p>
                <p><strong>Special Services:</strong> ${hospital.Specialized_Medical_Services ?? 'N/A'}</p>
            `;
            hospitalGrid.appendChild(card);
        });

        // Doctors
        data.doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>Dr. ${doctor.Name}</h3>
                <p><strong>Specialization:</strong> ${doctor.Specialization ?? 'General'}</p>
                <p><strong>Contact:</strong> ${doctor.Contact_Number ?? 'N/A'}</p>
                <p><strong>Hospital ID:</strong> ${doctor.Hospital_ID}</p>
            `;
            doctorGrid.appendChild(card);
        });

        // Emergency Response
        data.emergency_responses.forEach(response => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>Emergency Point</h3>
                <p><strong>Location:</strong> ${response.Location ?? 'N/A'}</p>
                <p><strong>Ambulance Available:</strong> ${response.Ambulance_Availability ? 'Yes' : 'No'}</p>
                <p><strong>Contact:</strong> ${response.Emergency_Contact_Number}</p>
            `;
            emergencyGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading healthcare data:', error);
        // Don't show an alert for this error to avoid bothering users on non-healthcare pages
    }
}

async function loadTransportData() {
    try {
        // Check if we're on the transport page by looking for specific container elements
        const transportContainers = document.querySelectorAll('.transport-category .transport-grid');
        if (transportContainers.length === 0) {
            console.log('Not on transport page, skipping transport data loading');
            return; // Not on the transport page, so exit early
        }

        const data = await makeApiRequest('transportation', 'GET');

        const categories = {
            "Bus": document.querySelector('.transport-category:nth-of-type(1) .transport-grid'),
            "Rickshaw": document.querySelector('.transport-category:nth-of-type(2) .transport-grid'),
            "Cab": document.querySelector('.transport-category:nth-of-type(3) .transport-grid')
        };

        // Verify that we have at least one container before proceeding
        if (!Object.values(categories).some(el => el !== null)) {
            console.warn('Transport category containers not found on page');
            return;
        }

        // Clear placeholders in existing containers
        Object.values(categories).forEach(container => {
            if (container) container.innerHTML = '';
        });

        data.forEach(item => {
            const container = categories[item.Transport_Type];
            if (!container) return; // Skip if container not found

            const card = document.createElement('div');
            card.className = 'transport-card';

            const timeInfo = item.Departure_And_Arrival_Timings
                ? (item.Transport_Type === "Bus"
                    ? item.Departure_And_Arrival_Timings.split(',').map(t => `<p><strong>${t.split(':')[0]}:</strong> ${t.slice(t.indexOf(':') + 1)}</p>`).join('')
                    : `<p><strong>Timing:</strong> ${item.Departure_And_Arrival_Timings}</p>`)
                : '';

            card.innerHTML = `
                <h4>${generateCardTitle(item)}</h4>
                <p><strong>Operator:</strong> ${item.Operator_Name}</p>
                <p><strong>Route:</strong> ${item.Route_Information}</p>
                ${timeInfo}
                <p><strong>Contact:</strong> ${item.Contact_Information}</p>
                <p><strong>Emergency Service:</strong> ${item.Emergency_Services ? '✅ Yes' : '❌ No'}</p>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching transport data:', error);
        // Only show alert if we're actually on the transport page
        if (document.querySelector('.transport-category')) {
            alert('Failed to load transport data. Please try again.');
        }
    }
}

function generateCardTitle(item) {
    if (item.Transport_Type === "Bus") return `${item.Transport_ID} - ${item.Operator_Name}`;
    if (item.Transport_Type === "Rickshaw") return item.Transport_ID.includes('Rickshaw') ? item.Transport_ID.replace(/([0-9]+)/, ' Stand $1') : item.Operator_Name;
    if (item.Transport_Type === "Cab") return item.Operator_Name === "City Cabs" ? "City Cabs Pvt Ltd" : "Festive Rides";
    return item.Operator_Name;
}

function initAccommodationData() {
    const container = document.querySelector('.accommodation-grid');
    if (!container) return;

    fetchAccommodationData()
        .then(data => {
            container.innerHTML = ''; // Clear previous content

            data.forEach(tent => {
                const card = document.createElement('div');
                card.className = 'accommodation-card';

                card.innerHTML = `
                    <h3>${tent.Tent_Name}</h3>
                    <p><strong>Location:</strong> ${tent.Location}</p>
                    <p><strong>Capacity:</strong> ${tent.Capacity}</p>
                    <p><strong>Availability:</strong> ${tent.Availability ? '✅ Available' : '❌ Not Available'}</p>
                    <p><strong>Contact:</strong> ${tent.Contact_For_Booking}</p>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching accommodation data:', error);
            alert('Failed to load accommodation information. Please try again.');
        });
}

async function fetchAccommodationData() {
    return makeApiRequest('/accommodation', 'GET');
}
