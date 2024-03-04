console.log('script has been imported');

const submitButton = document.getElementById('submit-button');
const namesInput = document.getElementById('name-input');
const searchStrings = [
    " AND abus! or accus! or alleg! or arraign! or arrest! or assault! or attack! or bankrupt! or beat! or breach! or brib!",
    " AND or ( chapter pre/1 7 or 11 ) or charg! or conspir! or co-conspir! or convict! or corrupt! or court! or crime",
    " AND criminal! or critici! or deceiv! or decept! or defendant or defraud! or denied or deny or disciplin! or discrim!",
    " AND distort! or embattled or fraud! or guilt! or harass! or illegal! or incriminat! or indict! or inside! info! or insolv! or investigat!",
    " AND judgement or judgment or launder! or liquidat! or litigat! or manipul! or misappropriat! or misconduct or misdeme! or mismanag!",
    " AND misrepresent! or negligen! or offen! or probat! or prosecut! or racketeer! or revocation or revoke* or risk! or sabotag!",
    " AND sanction! or scam! or scandal! or separat! or steal! or stole* or sued or suing or suspen! or terroris! or theft or threat! or unlawful!",
    " AND verdict or violat! or violen!"
];


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
            linkAnchor.textContent = "Link " + (j + 1);
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











