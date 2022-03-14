(function(global, document) { 

	function resTracker() {}

	function addReportTitle(data, table) {
        //    title: {
        //     "Restaurant": "",
        //     "Date": "",
        //    }
       const titleDetail = Object.keys(data["title"])
	   for (let i = 0; i < titleDetail.length; i++){
	      let key = titleDetail[i];

	      let tr = document.createElement('tr');
	      let th = document.createElement('th');
	      th.className = "title";
	      th.setAttribute("colspan", 8);
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
            table.appendChild(addOneDish(data["dishes"][i], orderNum));
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
        tr.setAttribute("id", "order"+orderNum);
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

    function addOneDish(dish, orderNum){
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
        tr.setAttribute("id", "order"+orderNum);
        tr.appendChild(td1);
        tr.appendChild(td3);
        tr.appendChild(td2);
        return tr;
    }

    function collapseOrders(id, orderNum, table, sub) {
        const hidElement = document.querySelectorAll("#order"+orderNum)
        for (let i = 0; i < hidElement.length; i++){
            hidElement[i].classList.add("displayNone");
        }
        const button = table.querySelector("#" + id)
        button.innerHTML = 'show'
        button.onclick = function() {expandOrders(id, orderNum, table, sub);}
    }

    function expandOrders(id, orderNum, table, sub) {
        const hidElement = document.querySelectorAll("#order"+orderNum)
        for (let i = 0; i < hidElement.length; i++){
            hidElement[i].classList.remove("displayNone");
        }
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

	}
	global.resTracker = global.resTracker || resTracker

})(window, window.document); 