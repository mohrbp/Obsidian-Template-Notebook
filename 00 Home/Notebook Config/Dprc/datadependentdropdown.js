const container = dv.container;

function generateDropdown(property, pages) {
    const selectElement = dv.el('select');

    // Extract unique values of the property
    const propertyValues = Array.from(new Set(pages.map(page => page[property])));

    // Create options for dropdown
    propertyValues.forEach(value => {
        const option = dv.el('option', value);
        selectElement.appendChild(option);
    });

    // Add event listener to filter pages based on selected value
    selectElement.addEventListener('change', function() {
        const selectedValue = this.value;
        const filteredPages = dv.pages().filter(page => page[property] === selectedValue);
        // You can do whatever you want with the filtered pages here
        console.log(filteredPages);
    });

    return selectElement;
}

// Example usage:
let category = input.category;
let pages = dv.pages()
const dropdown = generateDropdown(category, pages);
container.appendChild(dropdown); // Append dropdown to the container or any other container element
