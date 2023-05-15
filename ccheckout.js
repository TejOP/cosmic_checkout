// CONTENT ZONE AND HTML STUFF


let cosmic_checkout = function() {
    const template_html = '<div>you crazy sunuvabitch u did it</div>'

    const template_js = 'console.log("worked")'

    const content_zone_selector = '#content'

    const page_is_match = '"/" == window.location.pathname'

    const executeCampaign = () => {
        let count = 0
        let timer = setInterval(() => {
            if (count < 5) {
                count ++
                let data = document.querySelector(content_zone_selector)
                if (data != null && data!=undefined && data != '') {
                    document.querySelector(content_zone_selector).innerHTML = template_html
                    eval(template_js)
                    clearInterval(timer)
                }
            } else {
                clearInterval(timer)
            }
            
        }, 200)
        
        //TODO stats tracking 
    }

    try {
        if (eval(page_is_match)) {
            console.log('page_matched')
            executeCampaign()
        } 
    } catch (e) {
        console.log('Error evaluating page match')
        console.log(e)
    }


    // USER ID and CLIENT ID sections 

    window.checkoutClientId = '---cid---';

    // IF user has ID in localStorage then return else return false
    const checkoutID = () => {
        let id = localStorage.getItem("cosmiccheckoutid");
        if (id == null) {
            return false
        }
        return id 
    }

    const randomString = (length, chars) => {
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    // TODO generate user id 
    const generateID = () => {
        let rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return rString
    }

    const setUserID = () => {
        // check if cookie exists
        const idExistence = checkoutID();
        if (idExistence == false) {
            const id = generateID();
            localStorage.setItem("cosmiccheckoutid", id)
        } 
    }

    setUserID();

    const sendData = (payload) => {
        payload['id'] = window.checkoutClientId
        payload['visitor_id'] = checkoutID()
        if (payload['visitor_id'] != false) {
            const url = ''
            const otherParams = {
                headers: {
                    "content-type":"application/json"
                },
                body: payload,
                method: "POST"
            }
            console.log('payload to send to AWS for add_to_cart', payload)
            // fetch(url, otherParams)
            // .then(data =>{})
            // .then(res => {})
            // .then(error => {console.log(error)})
        }
    }

    const sendAddToCart = (data) => {
        let items = data['item']
        let payload = {items: items, action: "add_to_cart"}
        sendData(payload)
    }

    const originalDataLayerPush = dataLayer.push;

    const checkForKey = (object) => {
        try {
            if (object['event'] == 'add_to_cart') {
                sendAddToCart(object['ecommerce'])
            } else if (object['event'] == 'purchase') {
                sendPurchase(object['ecommerce'])
            }
        } catch (e) {

        }
    }

    dataLayer.push = function() {
        const args = Array.prototype.slice.call(arguments);
        args.forEach(arg => {
            if (typeof arg === 'object' && arg !== null) {
                checkForKey(arg);
            }
        });
        originalDataLayerPush.apply(dataLayer, args);
    }
}

cosmic_checkout()
