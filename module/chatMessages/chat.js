export function addChatListeners(html) {
    console.log(html.on('click'))
    debugger
}

function weaponAttack(event) {
    debugger
    const card = event.currentTarget.closest(".weapon")
    console.log(card);
}