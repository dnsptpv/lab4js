import cofeeData from '/data/cofee.json' assert {type: 'json'}

window.addEventListener('DOMContentLoaded', function() {
    const cardPlaceholer = document.querySelector('.card-placeholder');
    const button = document.querySelector('.btn-mix');
    
    /**
     * Функция выполняемая при нажатии на кнопку
     * Удаляем предидущий результат, если он был
     * Создаем карточку в соответствии с найденным рецептом
     */

    button.addEventListener("click", function() {
        const card = document.querySelector('.card');
        if (card) {
            cardPlaceholer.removeChild(card);
        }

        let index = getDrinkId();
        if (index >= 0) {
            new Card(cofeeData[index].title, cofeeData[index].description, cofeeData[index].image).render();   
        }
        else if (index === -1) {
            new Card("A strange mess", "Perhaps this drink is dangerous to health or maybe you have invented a new swill... Who knows?", "https://mirpozitiva.ru/wp-content/uploads/2019/11/1479734077_kofe10.jpg").render();
        }
        else if (index === -2) {
            new Card("Nothing, nothing at all", "What did you expect to see?", "https://acegif.com/wp-content/uploads/upgifsok/tumbleweed-acegif-49.gif").render();
        }

    });

    let ingredients = [];

    cofeeData.forEach(element => {
        element.ingredients.forEach(ingredient => {
            ingredients.push(ingredient);
        });
    });

    ingredients = [... new Set(ingredients)];
    ingredients.forEach(element => {
        new Checkbox(element, ".list-of-ingredients").render();
    });

});

/**
 * Функция получения индекса напитка в наборе данных
 * Сначала собираем в selected названия ингредиентов отмеченных чекбоксом
 * Сортируем и приводим к строке чтобы не сравнивать поэлементно
 * Полученную строку сравниваем с рецептами из данных
 * -1: ничего не найдено
 * -2: ничего не выбрано
 */

function getDrinkId() {
    const checkboxes = document.querySelectorAll(".checkbox");
    let selected = [];
    checkboxes.forEach(element => {
        if (element.lastElementChild.checked) {
            selected.push(element.children[0].textContent);
        }
    });

    if (!selected.length) {
        return -2;
    }

    selected = selected.sort().join();

    let id = -1;

    cofeeData.forEach(element => {
        let ingredientsString = element.ingredients.sort().join();
        if (selected === ingredientsString) {
            id = element.id - 1;
            return;
        }
    });

    return id;
}



class Checkbox {
    constructor(title, parent) {
        this.title = title;
        this.parent = document.querySelector(parent);
    }

    render() {
        const element = document.createElement('div');
        element.classList.add("checkbox");
        element.innerHTML = `
            <label>${this.title}</label>
            <input type="checkbox">
        `;
        this.parent.append(element);
    }
}

class Card {
    constructor(title, description, image, parent = ".card-placeholder") {
        this.title = title;
        this.description = description;
        this.image = image;
        this.parent = document.querySelector(parent);
    }

    render() {
        const element = document.createElement('div');
        element.classList.add("card");
        element.innerHTML = `
            <img src="${this.image}">
            <h2>${this.title}</h2>
            <p>${this.description}</p>
        `;
        this.parent.append(element);
    }
}