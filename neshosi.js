/**
 * Събира две числа a и b
 * @param {number} a Първо събираемо
 * @param {number} b Второ събираемо 
 * @returns Сумата от две числа
 */
export function sum(a, b){
    return a + b;
}

/*
Criteria
(3): colType + formatCurrency
(4): All above + COLUMN_TYPE + sortBy
(5): All above + groupBy
(6): All above +  enumerateData
 */


export const COLUMN_TYPE = {
    TEXT: 'text',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    DATE: 'date',
    TIME: 'time',
    TIMESPAN: 'timespan',
    CHECKBOX: 'checkbox',
    STATUS: 'status',
    ENUM: 'enum',
    CURRENCY: 'currency'
};

/**
 * Определя типа на елемент(item) за дадена колона(c).
 * @param {colType} c - Обект, който представлява колона.
 * @param {item} item - Елемент, за който трябва да се определи вида.
 * @returns Низ, представляващ типа на елемент(item) за колона(c).
 */
export const colType = (c, item) => c.dynamicType?.(item) || c.type;

/**
 * Приема стойност и връща форматиран валутен низ със символ $, последван от стойността.
 * @param {number} value - Числовата стойност за форматиране като валута.
 * @returns Низ, форматиран като валута, със символ $, последван от стойността.
 */
export const formatCurrency = (value) => "$" + value.toString();

/**
 * External function
 * @param value
 * @returns {value} formatted time string
 */
const formatTime = value => value;

/**
 * External function
 * @param value
 * @returns {value} formatted TimeSpan string
 */
const formatTimeSpan = value => value;

/**
 * External function.
 * @param value
 * @returns {value} formatted Date object
 */
const formatDate = value => value;

/**
 * Взема входните параметри и връща сортирано копие на масива.
 * @param {array} array  - Масив от обекти, които трябва да бъдат сортирани. 
 * @param {keys} keys - Функционални клавиши, използвани за определяне на реда на сортиране.
 * @param {asc} asc - Булева стойност, която показва дали масивът трябва да бъде сортиран във възходящ или низходящ ред.
 * @param {valueFormatter} valueFormatter - Функция, която приема входна стойност и връща форматирана стойност. 
 * @param {ifCallback} ifCallback - Функция, която използва за извършване на допълнителни проверки
 * @returns Сортирано копие на масива.
 */
export function sortBy(array, keys, asc = true, valueFormatter = undefined, ifCallback = undefined) {
    return array.slice().sort((a, b) => comparator(a, b, keys, asc, valueFormatter, ifCallback));
}

/**
 * Взема col обект и обект item и връща форматирана стойност въз основа на типа col и опциите за форматиране.
 * @param {col} col - Обект, който съдържа информация за колоната, в която ще се показва стойността на елемента.
 * @param {item} item - Обект, който съдържа стойността, която трябва да се покаже в колоната.
 * @returns 
Форматирана стойност въз основа на типа на колоната и опциите за форматиране.
 */
export function formatCellContent(col, item) {
    let formattedValue = col.key ? item[col.key] : item;

    if (col.format)
        formattedValue = col.format(item, col.key,);

    if (typeof formattedValue === 'number')
        switch (col.type) {
            case COLUMN_TYPE.TIME:
                formattedValue = formatTime(formattedValue); break;
            case COLUMN_TYPE.TIMESPAN:
                formattedValue = formatTimeSpan(formattedValue); break;
            case COLUMN_TYPE.DATE:
                formattedValue = formatDate(formattedValue); break;
            case COLUMN_TYPE.CURRENCY:
                formattedValue = formatCurrency(formattedValue); break;
        }
    else if (col.type == COLUMN_TYPE.STATUS)
        formattedValue = col.template(item);

    return formattedValue;
}

/**
 * Приема списък и ключ като входни параметри и връща обект, който групира елементите в списъка по стойността на ключа.
 * @param {list} list - Масив от обекти за групиране.
 * @param {key} key - Низ, който указва свойството, по което трябва да бъдат групирани обектите в списъка.
 * @returns Обект, който групира елементите в списъка по стойността на ключа.
 */
export function groupBy(list, key) {
    return list.reduce((res, x) => {
        (res[x[key]] = res[x[key]] || []).push(x);
        return res;
    }, {});
}

/**
 * 
Взема масив от данни и низ за име на свойство като входни параметри и връща HTML ul елемент
 * @param {data} data - Масив от обекти за изброяване.
 * @param {propertyName} propertyName - Низ, който указва свойството на обектите в масива от данни да се показват в елементите li.
 * @returns HTML ul елемент, който съдържа списък от li елементи, всеки от които показва стойността на propertyName за всеки елемент в масива от данни.
 */
export function enumerateData(data, propertyName) {

    if (!data || !Array.isArray(data))
        throw new Error("Data parameter should be array")

    const list = document.createElement('ul');

    for (let i = 0; i < data.length; i++) {
        const li = document.createElement('li');
        const clickEvent = new CustomEvent('item_selected', {item: data[i]})

        li.innerText = data[i][propertyName] || '';
        li.addEventListener('click', (e) => li.dispatchEvent(clickEvent))

        list.appendChild(li);
    }

    return list;
}


/**
 * External function. Do not put documentation on this.
 * @param a {any} 
 * @param b {any}
 * @param keys {string[]} 
 * @param asc {boolean} 
 * @param valueFormatter {function} 
 * @param ifCallback {function} 
 * @returns {boolean} 
 */
function comparator(a, b, keys, asc, valueFormatter, ifCallback) {
}