console.log('script has been imported');

const submitButton = document.getElementById('submit-button');
const namesInput = document.getElementById('name-input');
const searchStrings = [" AND Money!", " AND Theft!"];


function checkInput() {
    if (namesInput.value === "") {
        namesInput.classList.add('invalid-input');
    } else {
        namesInput.classList.remove('invalid-input');
        generateLinks();
    }
}

function generateLinks() {
    let linksContainer = document.getElementById('links-container');
    linksContainer.innerHTML = "";
    let names = namesInput.value.split(';');
    for (let i = 0; i < names.length; i++) {
        let container = document.createElement('div');
        let name = document.createElement('h5');
        name.textContent = names[i];
        container.appendChild(name)

        let linksList = document.createElement('ul');

        for (let j = 0; j < searchStrings.length; j++) {
            let link = document.createElement('li');
            let linkAnchor = document.createElement('a');
            linkAnchor.setAttribute('target', '_blank');
            linkAnchor.textContent = buildURL("\"" + names[i] + "\"" + searchStrings[j]);
            linkAnchor.href = buildURL("\"" + names[i] + "\"" + searchStrings[j]);
            link.appendChild(linkAnchor);
            linksList.appendChild(link);
        }
        container.appendChild(linksList);

        linksContainer.appendChild(container);
    }
}


function buildURL(string) { return "https:///www.google.com/search?q=" + encodeURIComponent(string); }

document.getElementById('submit-button').addEventListener('click', (event) => checkInput());











