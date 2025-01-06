let currentLanguage = 'en'; // Default language
let allMeals = []; // To store all meals for searching
let allSections = []; // To store all sections for filtering
let allDrinks = []
const body = document.querySelector(".body");
function loadNavbarTranslations(data) {
    // Update navbar items based on the current language
    document.getElementById('menu-link').innerText = currentLanguage === 'ka' ? data.header.menu_en : data.header.menu_ka;

}

function loadMeals() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const mealList = document.getElementById('meal-list');
            const menuTitle = document.getElementById('menu-title');
            const sectionButtons = document.getElementById('section-buttons');
            const showFullMenuButton = document.getElementById('show-full-menu');

            // Update the header title based on the current language
            menuTitle.innerText = currentLanguage === 'ka' ? data.header.title_en : data.header.title_ka;

            mealList.innerHTML = ''; // Clear the list before adding new items
            allMeals = []; // Reset all meals
            allDrinks=[]
            allSections = data.sections; // Store sections for filtering

            // Create section buttons
            sectionButtons.innerHTML = ''; // Clear existing buttons
            allSections.forEach(section => {
                const button = document.createElement('div');
                button.className = 'section-button';
                button.style.backgroundImage = `url(${section.img})`; // Set background image
                button.style.backgroundSize = 'cover'; // Ensure the image covers the button
                button.style.backgroundPosition = 'center'; // Center the image
            
                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'overlay'; // Add overlay class
            
                button.innerHTML = `
                    <span>${currentLanguage === 'ka' ? section.name_en : section.name_ka}</span>
                `;
                button.appendChild(overlay); // Append overlay to button



                button.addEventListener('click', () => {
                    showSection(section);
                    document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' }); // Scroll to the section
                });
                sectionButtons.appendChild(button);
            });

            loadNavbarTranslations(data)
            
            // Load all meals initially
            loadAllMeals(data);
            changeLanguage()


            // Hide the "Show Full Menu" button initially
            showFullMenuButton.style.display = 'none';
        })
        .catch(error => console.error('Error fetching the meal data:', error));
}

// Load meals when the page is loaded
document.addEventListener('DOMContentLoaded', loadMeals);

function loadAllMeals(data) {
    const mealList = document.getElementById('meal-list');
    allMeals = []; // Reset all meals

    // Loop through each section
    data.sections.forEach(section => {
        // Create a section header
        const sectionHeader = document.createElement('h2');
        sectionHeader.innerText = currentLanguage === 'ka' ? section.name_en : section.name_ka;
        mealList.appendChild(sectionHeader);

        // Loop through each item in the section
        section.items.forEach(meal => {
            const listItem = document.createElement('li');
            const mealName = currentLanguage === 'ka' ? meal.name_en : meal.name_ka;
            const valuta = currentLanguage === 'ka' ? meal.valuta_en : meal.valuta_ka;
            const liters = currentLanguage === 'ka'? meal.liters_en: meal.liters_ka;


            // Check if the section is Alcohol
            if (section.name_en === "Alcohol") {
                // Only show items with liters
                if (meal.liters) {
                    listItem.innerHTML = `<span class="meal-name">${mealName} (${meal.liters}L)</span> 
                    <span class="meal-price">${meal.price.toFixed(2) } ${valuta}</span>`;
                    mealList.appendChild(listItem);
                    allMeals.push({ name: mealName, price: meal.price }); // Store meal for searching
                }
            } else {
                // For other sections, show items without liters
                listItem.innerHTML = `<span class="meal-name">${mealName}</span> 
                <span class="meal-price">${meal.price.toFixed(2)} ${valuta}</span>`;
                mealList.appendChild(listItem);
                allMeals.push({ name: mealName, price: meal.price, valuta: valuta, liters: liters }); // Store meal for searching
            }
        });
    });
}







// Function to show meals in a specific section
function showSection(section) {
    const mealList = document.getElementById('meal-list');
    const showFullMenuButton = document.getElementById('show-full-menu');
    mealList.innerHTML = ''; // Clear the list before adding new items

    // Create a section header
    const sectionHeader = document.createElement('h2');
    sectionHeader.innerText = currentLanguage === 'ka' ? section.name_en : section.name_ka;
    mealList.appendChild(sectionHeader);

    
    const sectionElement = document.createElement('div');
    sectionElement.id = section.id; // Set the ID for scrolling
    mealList.appendChild(sectionElement);

    // Loop through each item in the section
    section.items.forEach(meal => {
        const listItem = document.createElement('li');
        const mealName = currentLanguage === 'ka' ? meal.name_en : meal.name_ka;
        const valuta = currentLanguage === 'ka' ? meal.valuta_en : meal.valuta_ka;

        // Check if the item has a liters attribute
        if (meal.liters) {
            listItem.innerHTML = `<span class="meal-name">${mealName} (${meal.liters}L)</span> 
            <span class="meal-price">${meal.price.toFixed(2)} ${valuta}</span>
            `;
        } else {
            listItem.innerHTML = `<span class="meal-name">${mealName}</span> 
            <span class="meal-price">${meal.price.toFixed(2)} ${valuta}</span>
          
            `;
        }

        mealList.appendChild(listItem);
    });

    // Show the "Show Full Menu" button
    showFullMenuButton.style.display = 'block'; // Show the button
}

// Show full menu when the button is clicked
document.getElementById('show-full-menu').addEventListener('click', () => {
    loadMeals(); // Reload the full menu
});

// Search functionality
document.getElementById('search-bar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = ''; // Clear the list before adding filtered items
    // If the search term is empty, reload the full menu
    if (searchTerm === '') {
        loadMeals();
        return; // Exit the function
    }
    // Filter meals based on the search term
    allMeals.forEach(meal => {
        const mealName = meal.name.toLowerCase();
        const valuta = meal.valuta
        
        if (mealName.includes(searchTerm)) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span class="meal-name">${meal.name}</span> 
            <span class="meal-price">${meal.price.toFixed(2)} ${valuta}</span>`;
            mealList.appendChild(listItem);
            console.log(meal)
        }
    });
});

function searchFun() {
    const search = document.querySelector("#search-bar");
    const menu_title = document.querySelector("#menu-title");
    search.addEventListener("keyup", () => {
        if(search.value === '') {
            menu_title.style.display = "block"
        }else {
            menu_title.style.display = "none"
        }
    })

    
}
searchFun()

// Language switch buttons
document.getElementById('english-btn').addEventListener('click', () => {
    currentLanguage = 'ka';
    loadMeals();
    changeLanguageBtn()
    changeLanguageBtnHide()
    updateEthnosTitle()

});

document.getElementById('georgian-btn').addEventListener('click', () => {
    currentLanguage = 'en';
    loadMeals();
    changeLanguageBtn()
    changeLanguageBtnHide()
    updateEthnosTitle()
});

// Load meals on initial page load
loadMeals();



function updateEthnosTitle() {
    const ethnosTitle = document.querySelector('.main_head_text');
    if (currentLanguage === 'en') {
        ethnosTitle.innerText = 'ეთნოსი'; // Georgian
    } else if(currentLanguage === "ka") {
        ethnosTitle.innerText = 'ETNOSI'; // English
    }
}

const Show = document.querySelector(".menu_show_button");
const Hide = document.querySelector(".menu_hidebutton");

const en = document.querySelector("#english-btn")
const  ge = document.querySelector("#georgian-btn")
// ეს უცვლის ფონტს ინგლისურ და ქართულ ენაზე გადაყვანის დროს
function changeFont() {
    en.addEventListener("click", () => {
    body.style.fontFamily = '"Manrope", serif'
    console.log("english font")
    ge.addEventListener("click", () => {
        body.style.fontFamily = '"Playwrite AU SA", serif'
        console.log("georgian font")
    })
    })

}
changeFont()
//ეს არის სექციების დამალვის და გამოჩენის ღილაკები
function changeLanguageBtn () {
    const lang = currentLanguage
    if(lang === "en") {
        Show.textContent = "მხოლოდ მენიუ"
    }else if (lang === "ka") {
        Show.textContent = "Only menu"
    }

}

//ეს არის სექციების დამალვის და გამოჩენის ღილაკები
function changeLanguageBtnHide () {
    const lang = currentLanguage
    if(lang === "en") {
        Hide.textContent = "მანახე სრულად"
    }else if (lang === "ka") {
        Hide.textContent = "Show me"
    }

}




//ეს არის იმისვის რომ ქართულ და ინგლისური ასოები არი იყოს შეყვანილი შეცდომით
//ანუ უნგლისურზე ინგლისურად შევიყვანოთ ქართულზე ქართულად
function restrictInput(event) {
    const currentLang = currentLanguage // ვებსაიტის ენა
    const key = event.key; // შეყვანილი კლავიში

    // თუ ვებსაიტი ქართულ ენაზეა
    if (currentLang === 'en') {
        // რეგულარული გამოხატულება ინგლისური ასოების შესამოწმებლად
        const englishRegex = /[a-zA-Z]/;
        if (englishRegex.test(key)) {
            event.preventDefault(); // შეწყვიტეთ შეყვანა
            alert("როდესაც საიტი არის ქართულე ენაზე ინგლისრი ასოების შეყვანა არ არის დასაშვები. / When the site is in Georgian, entering English letters is not allowed. ");
        }
    }

    // თუ ვებსაიტი ინგლისურ ენაზეა
    if (currentLang === 'ka') {
        // რეგულარული გამოხატულება ქართული ასოების შესამოწმებლად
        const georgianRegex = /[ა-ჰ]/;
        if (georgianRegex.test(key)) {
            event.preventDefault(); // შეწყვიტეთ შეყვანა
            alert("როდესაც საიტი არის ინგლისურ ენაზე ინგლისრი ასოების შეყვანა არ არის დასაშვები. / When the site is in English, entering English letters is not allowed.");
        }
    }
}

// ძიების ველზე მოვლენის დამუშავება
const searchInput = document.querySelector('#search-bar'); // ძიების ველის არჩევა
searchInput.addEventListener('keypress', restrictInput); //


function changeLanguage() {
    const lang = currentLanguage
    const button = document.querySelector("#show-full-menu")
    if (lang === "en") {
        button.textContent = "სრული მენიუს ჩვენება";
    } else if (lang === "ka") {
        button.textContent = "Show Full Menu";
    }
}

changeLanguage()



function handleMediaChange(e) {
    const button = document.getElementById("show");
    const filteredMenu = document.querySelector("#section-buttons");
    const hide = document.querySelector(".menu_hidebutton")

    if (e.matches) {
        // თუ ეკრანის სიგანე 768px-დან 1024px-მდეა
        button.style.display = "block"; // ღილაკი გამოჩნდება
    } else {
        // თუ ეკრანის სიგანე 768px-ზე ნაკლებია ან 1024px-ზე მეტი
        button.style.display = "none"; // ღილაკი დამალულია
    }

    button.addEventListener("click", () => {
        filteredMenu.style.display = "none"
        hide.style.display = "block"
        button.style.display = "none"
    
    })

    hide.addEventListener("click", () => {
        filteredMenu.style.display = "grid"
        hide.style.display = "none"
        button.style.display = "block"
    })
    
}




// შექმენით media query
const mediaQuery = window.matchMedia("(min-width: 0px) and (max-width: 768px)");


// პირველად შეამოწმეთ
handleMediaChange(mediaQuery);

// დაამატეთ listener
mediaQuery.addListener(handleMediaChange);