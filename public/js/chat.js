//Client side operations

const socket = io()

//Elements
const $Form = document.querySelector('#message-form')
const $Input = $Form.querySelector('input')
const $Button = $Form.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sendLocationTemplate = document.querySelector('#sendLocation-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    //How far I have scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(sendLocationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('hh:mm A')
    }) 
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$Form.addEventListener('submit', (e) => {
    e.preventDefault()

    //Disabling submit button when once msg is sent 
    $Button.setAttribute('disabled','disabled')

    const msg = e.target.elements.message.value //To get input data from form set in index.js

    socket.emit('sendMessage', msg, (error) => {

        //Re-enabling the disabled submit button
        $Button.removeAttribute('disabled')
        $Input.value = ''
        $Input.focus()

        if (error) {
            return console.log(error)
        } 

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    //Disabling send Location button when once location is sent 
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {

            //Re-enabling the disabled send Location button
            $sendLocationButton.removeAttribute('disabled')

            if (error) {
                return console.log(error)
            }

            console.log('Location shared!')
        })
    })
}) 

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})


//Counter Example
// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated ', count)
// })

// document.querySelector('#increment').addEventListener('submit', (e) => {
//     console.log('Clicked')
//     socket.emit('increment')
// })