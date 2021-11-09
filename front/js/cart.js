let localS = JSON.parse(localStorage.getItem('products'));
console.log(1, localS);
const cartItemId = document.querySelector('#cart__items');

getInCart();
totalItems();
newQtyAndPrice();
orderForm();
postDataForm();

// Création des items du panier
function getInCart() {
    if (localS === null || localS == 0) {
        cartItemId.innerHTML = `Votre panier est vide`;
    } else {
        localS = [...localS.reduce((acc, curr) => {
            // Création d'une clé unique pour différencier les élements de meme id/color
            const key = curr.articleId + '-' + curr.articleColor;
            // Si n'existe pas alors je créer un nouvel objet avec quantity à 0 via l'element
            const item = acc.get(key) || Object.assign({}, curr, {
              articleQuantity: 0,
            });
            // J'ajoute les quantités entre elles
            item.articleQuantity += curr.articleQuantity;
            // Je retourne l'item avec la quantité actualisée
            return acc.set(key, item);
            }, new Map).values()];

        for (let products in localS){
            //Creer l'article
            let elementArticle = document.createElement('article');
            document.querySelector('#cart__items').appendChild(elementArticle);
            elementArticle.classList.add = 'cart__item';
            elementArticle.setAttribute('data-id', `${localS[products].articleId}-${localS[products].articleColor}`);

            //Creer la div cart__item__img
            let elementDivImg = document.createElement('div');
            elementArticle.appendChild(elementDivImg);
            elementDivImg.classList.add('cart__item__img');

            //Creer l'image dans la div 'cart__item__img'
            let elementImg = document.createElement('img');
            elementDivImg.appendChild(elementImg);
            elementImg.src = localS[products].articleImg;
            elementImg.alt = localS[products].articleAltTxt;

            //Creer la div 'cart__item__content'
            let elementDivContent = document.createElement('div');
            elementArticle.appendChild(elementDivContent);
            elementDivContent.classList.add('cart__item__content');

            //Creer la div 'cart__item__content__titlePrice'
            let elementDivContentTitlePrice = document.createElement('div');
            elementDivContent.appendChild(elementDivContentTitlePrice);
            elementDivContentTitlePrice.classList.add('cart__item__content__titlePrice');

            //Creer le h2
            let elementTitle = document.createElement('h2');
            elementDivContentTitlePrice.appendChild(elementTitle);
            elementTitle.innerHTML = localS[products].articleName;

            //Creer l'element <p> contenant le prix
            let elementPrice = document.createElement('p');
            elementDivContentTitlePrice.appendChild(elementPrice);
            elementPrice.innerHTML = localS[products].articlePrice + " €";

            //Creer la div 'cart__item__content__settings'
            let elementDivSettings = document.createElement('div');
            elementDivContent.appendChild(elementDivSettings);
            elementDivSettings.classList.add('cart__item__content__settings');

            //Creer la div 'cart__item__content__settings__quantity'
            let elementDivSettingsQty = document.createElement('div');
            elementDivSettings.appendChild(elementDivSettingsQty);
            elementDivSettingsQty.classList.add('cart__item__content__settings__quantity');

            //Créer l'élement <p> contenant la couleur
            let elementColor = document.createElement('p');
            elementDivSettingsQty.appendChild(elementColor);
            elementColor.innerHTML = `Couleur : ${localS[products].articleColor}`;

            //Creer l'element <p> contenant le texte de quantité
            let elementQty = document.createElement('p');
            elementDivSettingsQty.appendChild(elementQty);
            elementQty.innerHTML = 'Quantité : ';

            //Insérer la quantité avec l'élément input
            let elementQtyInput = document.createElement('input');
            elementDivSettingsQty.appendChild(elementQtyInput);
            elementQtyInput.classList.add('itemQuantity');
            elementQtyInput.value = localS[products].articleQuantity;
            elementQtyInput.setAttribute('type', 'number');
            elementQtyInput.setAttribute('name', 'itemQuantity');
            elementQtyInput.setAttribute('min', "1");
            elementQtyInput.setAttribute('max', '100');

            //Créer la div 'cart__item__content__settings__delete' 
            let elementDelete = document.createElement('div');
            elementDivSettings.appendChild(elementDelete);
            elementDelete.classList.add('cart__item__content__settings__delete'); // je peux transformer classlist.add par classname =

            //Créer l'élément '<p>' 'deleteItem' 
            elementDeleteItm = document.createElement('p');
            elementDelete.appendChild(elementDeleteItm);
            elementDeleteItm.className = 'deleteItem';
            elementDeleteItm.innerHTML = 'Supprimer';
            

            /*const totalLine = [localS[products].articleName, localS[products].articleColor, localS[products].articleQuantity];
            console.log(13, totalLine);
            const reducer = (accumulator, current) => accumulator + current;
            console.log(20, totalLine.reduce(reducer));*/
            
        }
    }
    deleteItem();
}

//Récupérer la quantité des articles sélectionnés via la page produits et de leur prix. 
function totalItems() {
    //Ajouter la quantité totale
    let elementTotalQty = document.getElementById('totalQuantity');
    const totalQty = localS.reduce((accumulator, current) => accumulator + current.articleQuantity, 0);
    elementTotalQty.innerHTML = totalQty;
    console.log(3,totalQty);

    //Ajouter le prix total
    let elementTotalPrice = document.getElementById('totalPrice');
    const totalPrice = localS.reduce((accumulator, current) => accumulator + current.articlePrice * current.articleQuantity, 0);
    elementTotalPrice.innerHTML = totalPrice;
    console.log(4,totalPrice); 
}

//Changer la quantité d'articles via le panier
// Modification d'une quantité de produit
function newQtyAndPrice() {
    const listInputItemQty = document.querySelectorAll('.itemQuantity');
    listInputItemQty.forEach(input => {
        input.addEventListener('click', (event) =>{
            const dataItem = event.target.closest("article").dataset.id.split('-');
            const newQty = event.target.value;
            // Actualiser localS
            localS.forEach(kanape => {
                if(kanape.articleId === dataItem[0] && kanape.articleColor === dataItem[1]) {
                    kanape.articleQuantity = newQty;
                }
            });
            console.log(1, localS)
            // Actualiser le total
            totalItems();
        });
    });

}

//La suppression d'un article
function deleteItem(){
    // Récupere les balises p "Supprimer"
    const deleteButtons = document.querySelectorAll('.deleteItem');
    // Pour chaque bouton supprimer que je trouve, j'ajoute un eventListener
    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            // récupération du parent
            const dataItem = event.target.closest("article").dataset.id.split('-');
            if(dataItem.length) {
                // Suppression de l'article correspondant
                localS = localS.filter(item => item.articleId !== dataItem[0] || item.articleColor !== dataItem[1]);
                // Suppression des anciens articles
                const itemsContainer = document.getElementById('cart__items');
                while(itemsContainer.firstChild) {
                    // La liste n'est pas une copie, elle sera donc réindexée à chaque appel
                    itemsContainer.removeChild(itemsContainer.firstChild);
                }
                // Actualisation de la liste d'article 
                getInCart();
                // Actualisation de la liste d'article
                totalItems(); 
                // Actualisation du localStorage
                localStorage.setItem('products', JSON.stringify(localS));
            }    
            //Ajout d'une boîte de dialogue "alert"
            alert('Votre article a bien été supprimé')
        });
    });  
}

// Validation du formulaire
function orderForm() {
    let form = document.querySelector('.cart__order__form');

    // Ecouter la modification du Prénom
    form.firstName.addEventListener('change', function(){
        validFirstName(this);
    });

    // Création de la reg exp pour la validation du prénom
    const validFirstName = function(inputFirstName) {
        let regExpFirstName = new RegExp('^[a-zA-Z-]+$');
       
        // Récupération de la balise <p> '#firstNameErrorMsg'
        let firstName = inputFirstName.nextElementSibling;

         // Test de l'expression régulière
        if(regExpFirstName.test(inputFirstName.value)) {
            firstName.innerHTML = '';
        } else {
            firstName.innerHTML = 'Veuillez renseigner votre Prénom';
        }
    };

    // Ecouter la modification du Nom
    form.lastName.addEventListener('change', function(){
        validLastName(this);
    });

    // Création de la reg exp pour la validation du nom
    const validLastName = function(inputLastName) {
        let regExpLastName = new RegExp('^[a-zA-Z-]+$');
        
        // Récupération de la balise <p> '#lastNameErrorMsg'
        let lastName = inputLastName.nextElementSibling;

        // Test de l'expression régulière
        if(regExpLastName.test(inputLastName.value)) {
            lastName.innerHTML = '';
        } else {
            lastName.innerHTML = 'Veuillez renseigner votre Nom';
        }
    };

    // Ecouter la modification de l'Adresse
    form.address.addEventListener('change', function(){
        validAddress(this);
    });

    // Création de la reg exp pour la validation de l'adresse
    const validAddress = function(inputAddress) {
        let regExpAddress = new RegExp('^([0-9]){1-4}?([a-zA-Zàâäéèêëïîôöùûüç-])+([0-9]{1-5})$');
    
        // Récupération de la balise <p> '#addressErrorMsg'
        let address = inputAddress.nextElementSibling;

        // Test de l'expression régulière
        if(regExpAddress.test(inputAddress.value)) {
            address.innerHTML = '';
        } else {
            address.innerHTML = 'Veuillez renseigner votre adresse';
        }
    };

    // Ecouter la modification de la ville
    form.city.addEventListener('change', function(){
        validCity(this);
    });
    
    // Création de la reg exp pour la validation de la ville
    const validCity = function(inputCity) {
        let regExpCity = new RegExp('^[a-zA-Z-]+$');

        // Récupération de la balise <p> '#cityErrorMsg'
        let city = inputCity.nextElementSibling;

        // Test de l'expression régulière
        if(regExpCity.test(inputCity.value)) {
            city.innerHTML = '';
        } else {
            city.innerHTML = 'Veuillez renseigner votre ville';
        }
    };
    
    // Ecouter la modification de l'email
    form.email.addEventListener('change', function(){
        validEmail(this);
    });

    // Création de la reg exp pour la validation de l'email
    const validEmail = function(inputEmail) {
        let regExpEmail = new RegExp(
            '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$'
            );
        
        // Récupération de la balise <p> '#emailErrorMsg'
        let email = inputEmail.nextElementSibling;
        
        // Test de l'expression régulière
        if(regExpEmail.test(inputEmail.value)) {
            email.innerHTML = ''; 
        } else {
            email.innerHTML = 'Veuillez renseigner votre e-mail';
        }
    };
}

// Envoi des informations du formulaire
function postDataForm(){
    const orderBtn = document.getElementById('order');
    console.log(9,orderBtn);

    orderBtn.addEventListener('click', () => {
        orderForm();
        // Stocker les données saisies dans le local storage
        const inputFirstName = document.querySelector('#firstName').value;
        const inputLastName = document.querySelector('#lastName').value;
        const inputAddress = document.querySelector('#address').value;
        const inputCity = document.querySelector('#city').value;
        const inputEmail = document.querySelector('#email').value;
        

        // Créer un tableau qui contient les produits sélectionnés 
        let productsOredered = [];
        productsOredered.push(localS);

        // Créer un objet qui contient les infos du client et les produits sélectionnés 
        const order = {
            input : {
                firstName : inputFirstName,
                lastName : inputLastName,
                address : inputAddress,
                city : inputCity,
                email : inputEmail,
            },
            products : productsOredered,
        };console.log(order);

        // Injecter l'objet "order" au local storage
        localStorage.setItem('order', JSON.stringify(order));

        // Envoi de la requete POST
        const sendObject = fetch('http://localhost:3000/api/products', {
            method: 'POST',
            body: JSON.stringify(order),
            headers: { 
                'Content-Type': 'application/json',
            },
        });   
        
    });
}









