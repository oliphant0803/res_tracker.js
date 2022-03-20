(function(global, document) { 

	function resTracker() {}

	function addReportTitle(data, table) {
        //    title: {
        //     "Restaurant": "",
        //     "Date": "",
        //    }
       const titleDetail = Object.keys(data["title"])
       const ids = ["resName", "resDate"] 
	   for (let i = 0; i < titleDetail.length; i++){
	      let key = titleDetail[i];

	      let tr = document.createElement('tr');
	      let th = document.createElement('th');
	      th.className = "title";
	      th.setAttribute("colspan", 8);
          th.setAttribute("id", ids[i]);
	      th.innerText = data["title"][key];
	      tr.appendChild(th);
	      table.appendChild(tr);
	   }
	}

    function addOneOrder(data, table, sub){
        // order_i:{
        //     "orderNum" : "",
        //     "dishes": [{"name:", "count:"}]
        //      "tax": 
        //      "tip":
        // }
        const orderNum = data["orderNum"];
        let tr = document.createElement('tr');
	    let td = document.createElement('td');
        td.className = "orderHeader";
        td.setAttribute("colspan", 8);
        td.innerText = "Order #" + orderNum;

        const button = document.createElement('button')
		button.setAttribute('type', 'button')
		const buttonId = 'buttonOrder' + orderNum;
		button.setAttribute('id', buttonId)
		button.innerText = 'Hide'
		button.onclick = function() {collapseOrders(buttonId, orderNum, table, sub)}
		td.appendChild(button);
        table.appendChild(td);

        const headers = [["Dish", 3], ["Price",3], ["Counts",2]];
        for(let i=0; i < headers.length; i++){
            let th = document.createElement('th');
            th.setAttribute("colspan", headers[i][1]);
            th.setAttribute("id", "order"+orderNum);
            th.className = "rowHeader";
            th.innerHTML = headers[i][0];
            tr.appendChild(th);
        }

        table.appendChild(tr);
        for(let i=0; i < data["dishes"].length; i++){
            table.appendChild(addOneDish(data["dishes"][i], orderNum, i));
        }
        if(sub){
            const orderSubs = ["tax", "tip", "time"];
            for(let i=0; i< orderSubs.length; i++){
                table.appendChild(addSubOrder(data, orderSubs[i], orderNum, i));
            }
        }
        table.appendChild(addNoSubTotal(data, orderNum));
    }

    function calculateTotal(data){
        var total = 0;
        data["dishes"].forEach(element => {
            total += parseFloat(element["price"]) * parseInt(element["count"]);
        }); 
        total += parseFloat(data["tax"]);
        total += parseFloat(data["tip"]);
        return total;
    }

    function addNoSubTotal(data, orderNum){
        let tr = document.createElement('tr');
	    let td1 = document.createElement('td');
        td1.className = "subtotal";
        td1.setAttribute("colspan", 3);
        td1.innerHTML = "Order #" + orderNum +" total";
        let td2 = document.createElement('td');
        td2.className = "subtotal";
        td2.setAttribute("colspan", 5);
        td2.innerHTML = "$" + calculateTotal(data);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.setAttribute("id", "noSubTotal"+orderNum);
        return tr;
    }

    function addSubOrder(data, name, orderNum, i){
        let tr = document.createElement('tr');
	    let td1 = document.createElement('td');
        td1.className = "name";
        td1.innerText = name;
        let td2 = document.createElement('td');
        td2.className = "price";
        td2.innerText = data[name];
        tr.setAttribute("id", "order"+orderNum+name);
        tr.appendChild(td1);
        tr.appendChild(td2);
        if(i==0){
            tr.appendChild(addPartner(data, true));
        }
        else if(i==1){
            tr.appendChild(addPartner(data, false));
        }
        return tr;
    }

    function addPartner(data, isTitle){
	    let td = document.createElement('td');
        td.className = "subtotal";
        td.setAttribute("colspan", 5);
        if(isTitle){
            td.setAttribute("rowspan", 1);
            td.innerHTML = "Partner";
        }
        else{
            td.setAttribute("rowspan", 2);
            td.innerText = data["partner"];
        }
        return td;
    }

    function addOneDish(dish, orderNum, i){
        let tr = document.createElement('tr');
	    let td1 = document.createElement('td');
        td1.className = "dishName";
        td1.setAttribute("colspan", 3);
        td1.innerText = dish["name"];
        let td3 = document.createElement('td');
        td3.className = "dishPrice";
        td3.innerText = "$" + dish["price"];
        td3.setAttribute("colspan", 3);
        let td2 = document.createElement('td');
        td2.className = "dishCount";
        td2.innerText = dish["count"];
        td2.setAttribute("colspan", 2);
        tr.setAttribute("id", "order"+orderNum+"dish"+i);
        tr.appendChild(td1);
        tr.appendChild(td3);
        tr.appendChild(td2);
        return tr;
    }

    function collapseOrders(id, orderNum, table, sub) {
        const hidElement = table.querySelectorAll("#order"+orderNum)
        for (let i = 0; i < hidElement.length; i++){
            hidElement[i].classList.add("displayNone");
        }
        Array.from(table.children).forEach ((child) =>{
            const id = "order"+orderNum;
            console.log(child.id);
            if(child.id.includes(id)){
                child.classList.add("displayNone");
            }
        });
        const button = table.querySelector("#" + id)
        button.innerHTML = 'show'
        button.onclick = function() {expandOrders(id, orderNum, table, sub);}
    }

    function expandOrders(id, orderNum, table, sub) {
        const hidElement = document.querySelectorAll("#order"+orderNum)
        for (let i = 0; i < hidElement.length; i++){
            hidElement[i].classList.remove("displayNone");
        }
        Array.from(table.children).forEach ((child) =>{
            const id = "order"+orderNum;
            console.log(child.id);
            if(child.id.includes(id)){
                child.classList.remove("displayNone");
            }
        });
        const button = table.querySelector('#' + id)
        button.innerHTML = 'hide'
        button.onclick = function() {collapseOrders(id, orderNum, table, sub)}
    }

    function addRevenue(data, table){
        var revenue = 0;
        data["orders"].forEach(element => {
            revenue += calculateTotal(element);
        });
        let tr = document.createElement('tr');
	    let td1 = document.createElement('td');
        td1.className = "total";
        td1.setAttribute("colspan", 3);
        td1.innerHTML = "Revenue";
        let td2 = document.createElement('td');
        td2.className = "total";
        td2.setAttribute("colspan", 5);
        td2.innerHTML = "$" + revenue;
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }

    function validateDate(dateBody){
        const checkDate = new Date(dateBody);
        if(isNaN(checkDate.getTime())){
            return false
        }else{
            console.log(checkDate.getTime());
            return true
        }
    }

    function validateTime(timeBody){
        const timeA = timeBody.split(":");
        if(timeA.length != 3){
            return false
        }else{
            timeA.forEach((e) => {
                if(isNaN(parseInt(e)) || 0 >= parseInt(e) || parseInt >= 59){
                    return false
                }
            });
            if(parseInt(timeA[0] >= 23)){
                return false
            }
        }
        return true
    }

    function getCurrentTime(date){
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ':' + seconds;
        return strTime;
    }

    function findTotal(currReport, orderId){
        total = 0;
        const taxId = "#order"+orderId+"tax";
        const tipId = "#order"+orderId+"tip";
        total += parseFloat(currReport.querySelector(taxId).querySelector(".price").innerHTML)
        total += parseFloat(currReport.querySelector(tipId).querySelector(".price").innerHTML)

        Array.from(currReport.children).forEach((child) =>{
            if(child.id.includes("order"+orderId+"dish")){
                const price = parseFloat(child.children[1].innerHTML.substring(1))
                const count = parseInt(child.lastChild.innerHTML)
                total += price * count;
            }
        });
        return total;
    }

    function findRevenue(currReport){
        var revenue = 0;
        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            revenue += findTotal(currReport, orderId);
        });
        return revenue;
    }

    function editDish(currReport, dish, editId, dishName, dishPrice, dishCount){
        let total = findTotal(currReport, editId);
        let revenue = findRevenue(currReport);
        let oldValue = parseFloat(dish.children[1].innerHTML.substring(1)) * parseInt(dish.lastChild.innerHTML);
        let newValue = parseFloat(dishPrice) * parseInt(dishCount);
        total = total - oldValue + newValue;
        revenue = revenue - oldValue + newValue;
        dish.firstChild.innerHTML = dishName;
        dish.children[1].innerHTML = "$" + dishPrice;
        dish.lastChild.innerHTML = dishCount;
        currReport.querySelector("#noSubTotal"+editId).children[1].innerHTML = "$" + total;
        currReport.lastChild.lastChild.innerHTML = "$" + revenue;
    }

    function editOrderDetail(currReport, editId, orderArea, editBody, current){
        const orderNum = "order"+editId;
        // orderArea is dish and has a valid dish number
        if (orderArea.includes("dish", 0) && !isNaN(orderArea.substring(4))){
            let dishId = "#"+orderNum+orderArea;
            let dish = currReport.querySelector(dishId);
            if(currReport.contains(dish)){ //the dish is in report of given order num
                //change the dish tuple and update total
                const dishName = editBody[0];
                const dishPrice = editBody[1];
                const dishCount = editBody[2];
                editDish(currReport, dish, editId, dishName, dishPrice, dishCount);
            }else{
                console.log("Invalid dish id");
            }
        }else if(orderArea == "tax"){
            if(isNaN(parseFloat(editBody))){
                console.log("Tax must be number");
            }
            let tipBody = currReport.querySelector("#"+orderNum+"tax").querySelector(".price");
            let oldTip = tipBody.innerHTML;
            let total = findTotal(currReport, editId);
            total = total - parseFloat(oldTip) + parseFloat(editBody);
            tipBody.innerHTML =  parseFloat(editBody);
            let revenue = findRevenue(currReport) - oldTip + parseFloat(editBody);
            currReport.querySelector("#noSubTotal"+editId).children[1].innerHTML = "$" + total;
            currReport.lastChild.lastChild.innerHTML = "$" + revenue;

        }else if(orderArea == "tip"){
            if(isNaN(parseFloat(editBody))){
                console.log("Tip must be number");
            }
            let tipBody = currReport.querySelector("#"+orderNum+"tip").querySelector(".price");
            let oldTip = tipBody.innerHTML;
            let total = findTotal(currReport, editId);
            total = total - parseFloat(oldTip) + parseFloat(editBody);
            tipBody.innerHTML =  parseFloat(editBody);
            let revenue = findRevenue(currReport) - oldTip + parseFloat(editBody);
            currReport.querySelector("#noSubTotal"+editId).children[1].innerHTML = "$" + total;
            currReport.lastChild.lastChild.innerHTML = "$" + revenue;

        }else if(orderArea == "time"){
            let currBody = currReport.querySelector("#"+orderNum+"time");
            let timeBody = currBody.querySelector('.price');
            if(current){
                time = getCurrentTime(new Date);
                console.log("Current time is " + time);
                timeBody.innerHTML = time;
            }else{
                if(validateTime(editBody)){
                    timeBody.innerHTML = editBody;
                }else{
                    console.log("Invalid time format");
                }
            }
        }else if(orderArea == "partner"){
            let currBody = currReport.querySelector("#"+orderNum+"tip");
            currBody.querySelector(".subtotal").innerHTML = editBody;
        }else{
            console.log("Invalid order input");
        }
    }

    function currentDishCount(currReport, orderId){
        var count = 0;
        Array.from(currReport.children).forEach((child) =>{
            if(child.id.includes("order"+orderId+"dish")){
                count += 1;
            }
        });
        return count;
    }

    resTracker.prototype = {

		generateReport: function(data, id, sub){
            // title:{

            // },
            // orders: [
            //     {}, {}
            // ]
			const table = document.createElement('table');
            table.classList.add("reportTable");
			table.setAttribute('id', id);
            addReportTitle(data, table);
            for(let i = 0; i < data["orders"].length; i++){
                addOneOrder(data["orders"][i], table, sub);
            }
            addRevenue(data, table);
            return table;
		},

        editReportDetail: function(reportId, editInfo, mark){
            // editInfo: [editArea, editId, editBody]
            editArea = editInfo[0]
            editId = editInfo[1]
            editBody = editInfo[2]
            //check for valid input
            if(document.getElementById(reportId) == null) {
                console.log("The input element does not exist");
                return;
            } else if(document.getElementById(reportId).className != "reportTable"){
                console.log("The input element is not a report");
                return;
            }
            let currReport = document.getElementById(reportId);
            if(editArea == "title"){
                if(editId == "restaurant"){
                    // find id resName
                    currReport.querySelector("#resName").innerHTML = editBody;
                    if(mark){
                        currReport.querySelector("#resName").classList.add("marked");
                    }
                }else if(editId == "date"){
                    //find id resDate
                    let dateBody = currReport.querySelector("#resDate");
                    //check valid date format
                    if(validateDate(editBody)){
                        dateBody.innerHTML = editBody;
                        if(mark){
                            dateBody.classList.add("marked");
                        }
                    }else{
                        console.log(editBody + " is not a valid date format");
                    }
                }else{
                    //log console warning
                    console.log("Report does not contain " + editId + ", Please ensure the editInfo is inputted correctly!");
                }
            }else if(editArea == "order"){
                // edit report orders
                // edit id is order num, check if its in report
                if(currReport.contains(document.getElementById("order"+editId))){
                    orderArea = editBody[0]
                    editContent = editBody[1]
                    current = editBody[2]
                    editOrderDetail(currReport, editId, orderArea, editContent, current);
                }else{
                    console.log("Orders does not contain " + editId + ", Please ensure the editInfo is inputted correctly with valid order number!");
                }
            }

        },

        addOrder: function(data, reportId, mark, currentTime){

            //check for valid input
            if(document.getElementById(reportId) == null) {
                console.log("The input element does not exist");
                return;
            } else if(document.getElementById(reportId).className != "reportTable"){
                console.log("The input element is not a report");
                return;
            }

            //remove last child
            let currReport = document.getElementById(reportId);

            currReport.removeChild(currReport.lastChild);
            addOneOrder(data, currReport, true);
            if (currentTime){
                let currBody = currReport.querySelector("#order"+data["orderNum"]+"time");
                let timeBody = currBody.querySelector('.price');
                time = getCurrentTime(new Date);
                console.log("Current time is " + time);
                timeBody.innerHTML = time;
            }

            //add revenue
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            td1.className = "total";
            td1.setAttribute("colspan", 3);
            td1.innerHTML = "Revenue";
            let td2 = document.createElement('td');
            td2.className = "total";
            td2.setAttribute("colspan", 5);
            td2.innerHTML = "$" + findRevenue(currReport);
            tr.appendChild(td1);
            tr.appendChild(td2);
            currReport.appendChild(tr);
            
        },

        addDish: function(data, reportId, orderId, mark){
            //check for valid input
            if(document.getElementById(reportId) == null) {
                console.log("The input element does not exist");
                return;
            } else if(document.getElementById(reportId).className != "reportTable"){
                console.log("The input element is not a report");
                return;
            }
            let currReport = document.getElementById(reportId);
            if(currReport.contains(document.getElementById("order"+orderId))){
                //find the tax div
                let tipBody = currReport.querySelector("#order"+orderId+"tax");
                //check the current dish count in this order
                let dishId = currentDishCount(currReport, orderId);
                // newDish.setAttribute("id", "order"+orderId+"dish"+dishId);
                let newDish = addOneDish(data, orderId, dishId);
                currReport.insertBefore(newDish, tipBody)
            }
        },

        removeOrder: function(reportId, editInfo){

        },

        exportReport: function(reportId, toSummary){
            //return a order object
        },

        generateDishSummary: function(){

        }

	}
	global.resTracker = global.resTracker || resTracker

})(window, window.document); 