export let charactersAccepted = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-"

const linkfy = (s: string) => {
    let v = String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    v = v.toLowerCase().split("")?.map(letter => charactersAccepted.includes(letter) ? letter : "-").join("");
    while (v.includes('--'))
        v = v.split('--').join('-');
    v = v.split("")?.map((letter, i) => ((letter === "-" && i === 0) || (letter === "-" && i === v.length - 1)) ? "" : letter).join("");
    return v
}

export default linkfy