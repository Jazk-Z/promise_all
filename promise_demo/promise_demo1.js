class Promise {
    constructor(executor){
        this.state = 'pending'
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []
        const resolve = value => {
            console.log(value)
            if (this.state === 'pending') {
                this.state = 'fulfilled'
                this.value = value
                this.onFulfilledCallbacks.forEach(fun => fun())
            }
        }
        const reject = value => {
            if (this.state === 'pending') {
                this.state = 'rejected'
                this.reason = value
                this.onRejectedCallbacks.forEach(fun => fun())
            }
        }

        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then (onFulfilled, onRejected) {
        const promise = new Promise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                let x = onFulfilled(this.value)
                resolvePromise(promise, x, resolve, reject)
            }
            if (this.state === 'rejected') {
                let x = onRejected(this.reason)
                resolvePromise(promise, x, resolve, reject)
            }
            if (this.state === 'pending') {
                this.onRejectedCallbacks.push(() => {
                    let x = onRejected(this.reason)
                    resolvePromise(promise, x, resolve, reject)
                })
                this.onFulfilledCallbacks.push(() => {
                    let x = onFulfilled(this.value)
                    resolvePromise(promise, x, resolve, reject)
                })
            }
        })
        return promise
    }
}

function resolvePromise() {
    console.log(arguments)
}
//
// new Promise((resolve, rejected) =>{
//     setTimeout(() => {
//         resolve(1)
//     }, 1000)
// }).then(console.log)
// new Promise((resolve, rejected) =>{
//     resolve(1)
// }).then(console.log)
let p = new Promise(resolve => {
    resolve(0);
});
var p2 = p.then(data => {
    // 循环引用，自己等待自己完成，一辈子完不成
    return p2;
})
