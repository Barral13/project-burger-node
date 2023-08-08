const express = require('express')
const uuid = require('uuid')

const port = 3000
const server = express()
server.use(express.json())

const orders = []

const logRequest = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: ${request.url}`);
    next();
}

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)
    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    request.index = index
    request.userId = id
    next()
}

server.use(logRequest)

server.get('/orders', (request, response) => {
    return response.json(orders)
})

server.post('/orders', (request, response) => {
    const { order, clientName, price, status } = request.body
    const id = uuid.v4()

    const newOrder = { id, order, clientName, price, status }
    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

server.put('/orders/:id', checkOrderId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.index
    const id = request.userId

    const updadeOrder = { id, order, clientName, price, status }

    orders[index] = updadeOrder

    return response.json(updadeOrder)
})

server.delete('/orders/:id', checkOrderId, (request, response) => {
    const index = request.index

    orders.splice(index, 1)

    return response.status(204).json()
})

server.get('/order/:id', checkOrderId, (request, response) => {
    const { index } = request

    const order = orders[index]
    return response.json(order)
})

server.patch('/orders/:id', checkOrderId, (request, response) => {
    const { index } = request

    orders[index].status = "Pronto";

    return response.json(orders[index])
})

server.listen(port, () => {
    console.log(`=> Server started on port ${port} <=`)
})