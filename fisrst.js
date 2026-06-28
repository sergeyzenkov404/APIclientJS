const readline = require('readline/promises');
const urlMeteo = "https://api.open-meteo.com/v1/forecast?"
const urlFantlab = "https://api.fantlab.ru/"
const cityMap = new Map(
        [
    ["minsk", "latitude=53.9006&current=temperature_2m,relative_humidity_2m&longitude=27.5590"],
    ["vitebsk", "latitude=55.1904&current=temperature_2m,relative_humidity_2m&longitude=30.2049"],
    ["brest", "latitude=52.0975&current=temperature_2m,relative_humidity_2m&longitude=23.6877"],
    ["grodno", "latitude=53.6667&current=temperature_2m,relative_humidity_2m&longitude=23.8333"],
    ["gomel", "latitude=52.4453&current=temperature_2m,relative_humidity_2m&longitude=30.9842"],
    ["mogilev", "latitude=53.9167&current=temperature_2m,relative_humidity_2m&longitude=30.3500"],
    //["vit", "latitude=55.1904&current=temperature_2m,relative_humidity_2m&longitude=30.2049"],
   // ["br", "latitude=52.0975&current=temperature_2m,relative_humidity_2m&longitude=23.6877"],
  //  ["grod", "latitude=53.6667&current=temperature_2m,relative_humidity_2m&longitude=23.8333"],
  //  ["gom", "latitude=52.4453&current=temperature_2m,relative_humidity_2m&longitude=30.9842"],
   // ["mog", "latitude=53.9167&current=temperature_2m,relative_humidity_2m&longitude=30.3500"]
    
        ]
)

function hi() {
        console.log("Варианты взаимодейтвия:")
        console.log("1. Вывод погоды в городе")
        console.log("2. Поиск автора на Fantlab по имени")
        console.log("3. Вывод информации об авторе по id на Fantlab")
        console.log("4. Вывод списква книг автора по id на Fantlab")
        console.log("0. Начать заново")

    }

async function getMeteo(input) {
    const resp = await fetch(urlMeteo+cityMap.get(input))
    return await resp.json();
}

async function handlerMeteo(input) {
    try {
        const inputData = await getMeteo(input)
        console.log(`Температура ${inputData.current.temperature_2m}${inputData.current_units.temperature_2m}`)
        console.log(`Влажность ${inputData.current.relative_humidity_2m}${inputData.current_units.relative_humidity_2m}`)
    } catch (error) {
        console.error(error)
    }
}

async function searchAutorsFantlab(url, name) {
    const resp = await fetch(url+`/search-autors?q=${name}&page=1`)
    return await resp.json();
}

async function getAutorInfo(url, id) {
   const resp = await fetch(url+`/autor/${id}?biography=${id}`)
      // const resp = await fetch(url+`/autor/${id}`)
   
    return await resp.json();
}
async function getAutorBooks(url, id) {
   const resp = await fetch(url+`/autor/${id}?biblio_blocks=${id}`)
      // const resp = await fetch(url+`/autor/${id}`)
  // console.log(resp)
    return await resp.json();
}

async function handlerAutors(input) {
    if (typeof input === "string") {
    try {
        const inputData = await searchAutorsFantlab(urlFantlab, input)
        console.log(`Поиск по автору ${input}`)
        console.log(inputData)
    } catch (error) {
        console.error(error)
    }
    } else if (typeof input === "number") {
        try {
            const inputData = await getAutorInfo(urlFantlab, input)
            console.log(`Информация об авторе ${inputData.name}`)
            console.log(inputData.anons)
           //  console.log(inputData.biography)
        } catch (error) {
            console.error(error)
        }
        
    }
}

async function handlerBook(input) {
    if (typeof input === "number") {
        try {
        const data = await getAutorBooks(urlFantlab, input)
          //console.log(data)
        console.log("Романы: \n") 
        //console.log(data.works_blocks[6].list[1])
        data.works_blocks[6].list.forEach((value, index) => {
            console.log(`${index+1}. ${value.work_name}`)
            console.log(`Рейтинг: ${value.rating.rating}\nГод: ${value.work_year}`)
        })
        } catch (error) {
            console.error(error)
        }
    }
}

async function start() {
    hi()
        const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
        });

 for (;;){  
    const input = (await readLine.question("Введите номер действия:\n"));

    switch (input) {
        case "1":
            city = (await readLine.question("Введите город:\n")).toLowerCase();  
            await handlerMeteo(city)
            break;
        case "2":
            autorName = (await readLine.question("Введите имя автора:\n")).toLowerCase();
            await handlerAutors(autorName)
            break;
        case "3":
            id = Number((await readLine.question("Введите id необходимого автора из полученного списка в пункте 2\n")));
            await handlerAutors(id)
            break;
        case "4":
            id = Number(await readLine.question("Введите id автора для поиска книг\n"));
            await handlerBook(id)
            break;
        case "0":
            hi()
            break;
        default:
            console.log("Неверный вариант")
            hi()
            break;

    }
 }
  readLine.close();
}

start()