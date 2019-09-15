const serverUrl = "https://oc-jswebsrv.herokuapp.com";


//Create and return a DOM element that displays link's datas
//Argument link in this function must be an object

const createLinkElement = link => {
    const titleElement = document.createElement("a");
    titleElement.href = link.url;
    titleElement.style.color = "#428bca";
    titleElement.style.textDecoration = "none";
    titleElement.style.marginRight = "5px";
    titleElement.appendChild(document.createTextNode(link.titre));

    const urlElement = document.createElement("span");
    urlElement.appendChild(document.createTextNode(link.url));

    // this line is composed with the title and the URL from the link
    const lineTitleElement = document.createElement("h4");
    lineTitleElement.style.margin = "0px";
    lineTitleElement.appendChild(titleElement);
    lineTitleElement.appendChild(urlElement);

    //This line is composed with the author name and the numbers of commentaries 
    const lineDetailsElement = document.createElement("span");
    lineDetailsElement.appendChild(document.createTextNode(`Ajouté par ${link.auteur}`));

    const divLinkElement = document.createElement("div");
    divLinkElement.classList.add("link");
    divLinkElement.appendChild(lineTitleElement);
    divLinkElement.appendChild(lineDetailsElement);

    return divLinkElement;
}

const contentElement = document.getElementById("content");

// Getting the links from the server
ajaxGet(`${serverUrl}/api/liens`, response => {
    // List of links to display in the page. A link is defined by:
    // - his title
    // - his URL
    // - his author (name of the person who posted the link)

    const linksList = JSON.parse(response);
    // Adding a DOM element for each link
    linksList.forEach(link => {
        const linkElement = createLinkElement(link);
        return contentElement.appendChild(linkElement);
    });
});

// Create and return a DOM input element 
const createInputElements = (placeholder, size) => {
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.setAttribute("placeholder", placeholder);
    inputElement.setAttribute("size", size);
    inputElement.setAttribute("required", "true");
    return inputElement;
}

const addLinkElement = document.getElementById("addLink");
// Give the abality to create a link by clicking on the button
addLinkElement.addEventListener("click", () => {
    const authorElement = createInputElements(`Entrez votre nom`, 20);
    const titleElement = createInputElements(`Entrez le titre du lien`, 40);
    const urlElement = createInputElements(`Entrez l'URL du lien`, 40);

    const addElements = document.createElement("input");
    addElements.type = "submit";
    addElements.value = "Ajouter";

    const formAddElement = document.createElement("form");
    formAddElement.appendChild(authorElement);
    formAddElement.appendChild(titleElement);
    formAddElement.appendChild(urlElement);
    formAddElement.appendChild(addElements);

    const p = document.querySelector("p");
    // Replace the button for the form
    p.replaceChild(formAddElement, addLinkElement);

    // Add the new link
    formAddElement.addEventListener("submit", () => {
        let url = urlElement.value;
        // Case if the URL does NOT begin with "http://" or "https://"
        if ((url.indexOf("http://") !== 0) && (url.indexOf("https://") !== 0)) {
            // Let's add the "http://"
            url = `http://${url}`;
        }

        // Create the new link's datas object 
        const link = {
            titre: titleElement.value,
            url,
            auteur: authorElement.value
        };
        
        // For sending the new link to the server
        ajaxPost(`${serverUrl}/api/lien`, link,
            response => {
                const linkElement = createLinkElement(link);
                // Add the new link as head of the list
                contentElement.insertBefore(linkElement, contentElement.firstChild);

                // Confirm message sending
                const infoElement = document.createElement("div");
                infoElement.classList.add("info");
                infoElement.textContent = `Le link \ ${link.titre} \ a bien été ajouté.`;
                p.insertBefore(infoElement, addLinkElement);
                // Delete this message after 2 seconds.
                setTimeout(() => {
                    p.removeChild(infoElement);
                }, 2000);
            },
            true
        );
        // Finally replace the form for the former addButton
        p.replaceChild(addLinkElement, formAddElement);
    });
});