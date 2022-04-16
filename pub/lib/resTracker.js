(function(global, document) { 

	function resTracker() {}

	function addReportTitle(data, table, date, include) {
        //    title: {
        //     "Restaurant": "",
        //     "Date": "",
        //    }
        
       const titleDetail = Object.keys(data["title"])
       const ids = ["resName", "resDate"] 
       if(include){
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
	   

        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.className = "title";
        th.setAttribute("colspan", 8);
        th.setAttribute("id", "resDate");
        th.innerText = date

        var dateClass = date.replaceAll(',', '');
        dateClass = dateClass.replaceAll(' ', '');
        dateClass = "d"+dateClass;

        const button = document.createElement('button')
		button.setAttribute('type', 'button')
		const buttonId = 'buttonDate' + dateClass;
		button.setAttribute('id', buttonId)
		button.innerText = 'Hide'
		button.onclick = function() {collapseDate(buttonId, dateClass)}
		th.appendChild(button);

        tr.appendChild(th);

        table.appendChild(tr);
	}

    function addOneOrder(data, table, sub, date, parent){
        // order_i:{
        //     "orderNum" : "",
        //     "dishes": [{"name:", "count:"}]
        //      "tax": 
        //      "tip":
        // }
        var dateClass = date.replaceAll(',', '');
        var dateClass = dateClass.replaceAll(' ', '');
        var dateClass = "d"+dateClass;
        if(date != data["date"]){
            return
        }
        const orderNum = data["orderNum"];
        let tr = document.createElement('tr');
	    let td = document.createElement('td');
        td.className = "orderHeader";
        td.classList.add(dateClass);
        td.setAttribute("colspan", 8);
        td.innerText = "Order #" + orderNum;

        const button = document.createElement('button')
		button.setAttribute('type', 'button')
		const buttonId = 'buttonOrder' + orderNum;
		button.setAttribute('id', buttonId)
		button.innerText = 'Hide'
        if(parent){
            button.onclick = function() {collapseOrders(buttonId, orderNum, table, sub)}
        }else{
            button.onclick = function() {collapseOrders(buttonId, orderNum, table.parentNode, sub)}
        }
		td.appendChild(button);
        if(parent){
            table.appendChild(td);
        }else{
            table.parentNode.insertBefore(td, table.nextSibling);
        }


        const headers = [["Dish", 3], ["Price",3], ["Counts",2]];
        for(let i=0; i < headers.length; i++){
            let th = document.createElement('th');
            th.setAttribute("colspan", headers[i][1]);
            th.setAttribute("id", "order"+orderNum);
            th.className = "rowHeader";
            th.innerHTML = headers[i][0];
            tr.appendChild(th);
            tr.classList.add(dateClass);
        }
        
        if(parent){
            table.appendChild(tr);
        }else{
            td.parentNode.insertBefore(tr, td.nextSibling);
        }
        var currNode = tr;
        var nextNode;
        for(let i=0; i < data["dishes"].length; i++){
            if(parent){
                table.appendChild(addOneDish(data["dishes"][i], orderNum, i, dateClass));
            }else{
                if(i==0){
                    currNode = tr;
                }
                else{
                    currNode = nextNode;
                }
                nextNode = addOneDish(data["dishes"][i], orderNum, i, dateClass)
                currNode.parentNode.insertBefore(nextNode, currNode.nextSibling);
            }
        }
        currNode = nextNode;
        if(sub){
            const orderSubs = ["tax", "tip", "time"];
            for(let i=0; i< orderSubs.length; i++){
                if(parent){
                    table.appendChild(addSubOrder(data, orderSubs[i], orderNum, i, dateClass));
                }else{
                    currNode = nextNode;
                    nextNode = addSubOrder(data, orderSubs[i], orderNum, i, dateClass);
                    currNode.parentNode.insertBefore(nextNode, currNode.nextSibling);
                }
            }
        }
        
        if(parent){
            table.appendChild(addNoSubTotal(data, orderNum, dateClass));
        }else{
            nextNode.parentNode.insertBefore(addNoSubTotal(data, orderNum, dateClass), nextNode.nextSibling);
        }
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

    function addNoSubTotal(data, orderNum, dateClass){
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
        tr.classList.add(dateClass);
        return tr;
    }

    function addSubOrder(data, name, orderNum, i, dateClass){
        let tr = document.createElement('tr');
        tr.classList.add(dateClass);
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

    function addOneDish(dish, orderNum, i, dateClass){
        let tr = document.createElement('tr');
        tr.classList.add(dateClass);
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
        const hidElement = document.querySelectorAll("#order"+orderNum)
        for (let i = 0; i < hidElement.length; i++){
            hidElement[i].classList.add("displayNone");
        }
        console.log(table)
        Array.from(table.children).forEach ((child) =>{
            const i = "order"+orderNum;
            if(child.id.includes(i)){
                child.classList.add("displayNone");
            }
        });
        console.log(id)
        const button = document.querySelector("#" + id)
        button.innerHTML = 'Show'
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
        const button = document.querySelector('#' + id)
        button.innerHTML = 'Hide'
        button.onclick = function() {collapseOrders(id, orderNum, table, sub)}
    }

    function collapseDate(buttonId, dateClass){
        const hidElement = document.querySelectorAll("."+dateClass)
        for (let i = 0; i < hidElement.length; i++){
            hidElement[i].classList.add("displayNone");
        }
        const button = document.querySelector('#' + buttonId)
        button.innerHTML = 'Show'
        button.onclick = function() {expandDate(buttonId, dateClass)}
    }

    function expandDate(buttonId, dateClass){
        const hidElement = document.querySelectorAll("."+dateClass)
        for (let i = 0; i < hidElement.length; i++){
            hidElement[i].classList.remove("displayNone");
        }
        const button = document.querySelector('#' + buttonId)
        button.innerHTML = 'Hide'
        button.onclick = function() {collapseDate(buttonId, dateClass)}
    }

    function addRevenue(data, table, date){
        var revenue = 0;
        data["orders"].forEach(element => {
            if(date == element.date){
                revenue += calculateTotal(element);
            }
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

    // function findRevenue(currReport){
    //     var revenue = 0;
    //     currReport.querySelectorAll(".orderHeader").forEach((order) => {
    //         const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
    //         revenue += findTotal(currReport, orderId);
    //     });
    //     return revenue;
    // }

    function findRevenueByDate(currReport, date, formatted){
        var dateClass;
        if(!formatted){
            dateClass = date.replaceAll(',', '');
            dateClass = dateClass.replaceAll(' ', '');
            dateClass = "d"+dateClass;
        }else{
            dateClass = date;
        }
        var revenue = 0;

        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            if(currReport.querySelector("#noSubTotal"+orderId).classList.contains(dateClass)){
                revenue += findTotal(currReport, orderId);
            }

        });
        return Math.round(revenue*100)/100;
    }

    function editDish(currReport, dish, editId, dishName, dishPrice, dishCount, date){
        let total = findTotal(currReport, editId);
        let revenue = findRevenueByDate(currReport, date, true);
        let oldValue = parseFloat(dish.children[1].innerHTML.substring(1)) * parseInt(dish.lastChild.innerHTML);
        let newValue = parseFloat(dishPrice) * parseInt(dishCount);
        total = total - oldValue + newValue;
        revenue = revenue - oldValue + newValue;
        dish.firstChild.innerHTML = dishName;
        dish.children[1].innerHTML = "$" + dishPrice;
        dish.lastChild.innerHTML = dishCount;
        currReport.querySelector("#noSubTotal"+editId).children[1].innerHTML = "$" + total;
        var currDateDiv = currReport.querySelectorAll("."+date);
        var currDateDiv = currDateDiv[currDateDiv.length-1];
        var nextDiv = currDateDiv.nextSibling;
        nextDiv.lastChild.innerHTML = "$" + revenue;
    }

    function editOrderDetail(currReport, editId, orderArea, editBody, current, date){
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
                editDish(currReport, dish, editId, dishName, dishPrice, dishCount, date);
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
            let revenue = findRevenueByDate(currReport, date, true) - oldTip + parseFloat(editBody);
            currReport.querySelector("#noSubTotal"+editId).children[1].innerHTML = "$" + total;
            var currDateDiv = currReport.querySelectorAll("."+date);
            var currDateDiv = currDateDiv[currDateDiv.length-1];
            var nextDiv = currDateDiv.nextSibling;
            nextDiv.lastChild.innerHTML = "$" + revenue;

        }else if(orderArea == "tip"){
            if(isNaN(parseFloat(editBody))){
                console.log("Tip must be number");
            }
            let tipBody = currReport.querySelector("#"+orderNum+"tip").querySelector(".price");
            let oldTip = tipBody.innerHTML;
            let total = findTotal(currReport, editId);
            total = total - parseFloat(oldTip) + parseFloat(editBody);
            tipBody.innerHTML =  parseFloat(editBody);
            let revenue = findRevenueByDate(currReport, date, true) - oldTip + parseFloat(editBody);
            currReport.querySelector("#noSubTotal"+editId).children[1].innerHTML = "$" + total;
            var currDateDiv = currReport.querySelectorAll("."+date);
            var currDateDiv = currDateDiv[currDateDiv.length-1];
            var nextDiv = currDateDiv.nextSibling;
            nextDiv.lastChild.innerHTML = "$" + revenue;

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

    function selectChart(currReport){

        var select = document.querySelector("#charts");
        var curr = currReport.closest("div");
        if(curr.childElementCount > 2){
            curr.removeChild(curr.lastChild);
        }
        if(select.value == "dish chart"){
            curr.appendChild(displayChart(currReport, "dish"));
        }else if(select.value == "timeline chart"){
            curr.appendChild(displayChart(currReport, "timeline"));
        }else if(select.value == "partner chart"){
            curr.appendChild(displayChart(currReport, "partner"));
        }else if(select.value == "revenue chart"){
            curr.appendChild(displayChart(currReport, "revenue"));
        }
    }

    function inputCheckBox(data, col, id, filter, sort, currReport){
        //data is partners map
        if(sort){
            var form = document.createElement("form");
            // form.onsubmit = "return false";
            // var sortA = ["most ordered", "least ordered", "highest price", "lowest price"];
            // sortA.forEach((name) => {
            //     input = document.createElement("input");
            //     input.setAttribute("type", "checkbox");
            //     input.value = name;
            //     label = document.createElement("label");
            //     label.innerHTML = name;
            //     form.appendChild(input);
            //     form.appendChild(label);
            //     form.appendChild(document.createElement("br"));
            // });
            // form.appendChild(document.createElement("br"));
            
            // var submit = document.createElement("input");
            // submit.setAttribute("type", "submit");
            form.addEventListener('change', function(e){
                e.preventDefault();

                sortOption(id, currReport);
            });
            form.setAttribute("id", "select"+id);
            var sortA = ["Order Count", "Price", "Name (A-Z)"];
            var select = document.createElement("select");
            var option = document.createElement("option");
            option.innerHTML = "sort";
            option.value = "default";
            select.appendChild(option);
            sortA.forEach((name) => {
                
                var optgroup = document.createElement("optgroup");
                optgroup.label = name;
                ['&uarr;', '&darr;'].forEach((order) => {
                    var option = document.createElement("option");
                    option.value = name + order;
                    option.innerHTML = name+" " + order;
                    optgroup.appendChild(option);
                });
                select.appendChild(optgroup);
            });

            form.appendChild(select);
            col.appendChild(form);
        }

        if(filter){
            var form = document.createElement("form");
            form.addEventListener('change', function(e){
                e.preventDefault();
                filterPartner(id, currReport);
            });
            var sortA = Array.from(data.keys());
            console.log(data);
            sortA.forEach((name) => {
                input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.value = name;
                input.checked = true
                label = document.createElement("label");
                label.innerHTML = name;
                form.appendChild(input);
                form.appendChild(label);
                form.appendChild(document.createElement("br"));
            });
            form.appendChild(document.createElement("br"));
            // var submit = document.createElement("input");
            // submit.setAttribute("type", "submit");
            // form.appendChild(submit);
            col.appendChild(form);
        }
    }

    function inputDishesTable(data, table, id, currReport){
        //data is dishes map
        let tr = document.createElement('tr');
        const headers = [["Dish", 3], ["Price",3], ["Counts",2]];
        for(let i=0; i < headers.length; i++){
            let th = document.createElement('th');
            th.setAttribute("colspan", headers[i][1]);
            th.className = "rowHeader";
            th.innerHTML = headers[i][0];
            tr.appendChild(th);
        }
        table.appendChild(tr);
        let keys = Array.from( data.keys() );
        keys.forEach((dish) => {
            var dishObject = {"name": "", "price": "", "count": ""};
            dishObject["name"] = dish;
            dishObject["price"] = data.get(dish)[0];
            dishObject["count"] = data.get(dish)[1];
            table.appendChild(addOneDish(dishObject));
        });
    }

    function orderSummaryToDishes(currReport){
        const partners = new Map();
        const dishes = new Map();
        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            Array.from(currReport.children).forEach((child) =>{
                if(child.id.includes("order"+orderId+"dish")){
                    const dishName = child.children[0].innerHTML;
                    const price = parseFloat(child.children[1].innerHTML.substring(1));
                    const count = parseInt(child.lastChild.innerHTML);
                    if(!dishes.has(dishName)){
                        dishes.set(dishName, [0, 0]);
                    }
                    dishes.get(dishName)[0] = price;
                    dishes.get(dishName)[1] += count;
                    
                    const tipId = "#order"+orderId+"tip";
                    const partnerName = currReport.querySelector(tipId).querySelector(".subtotal").innerHTML;
                    if(!partners.has(partnerName)){
                        partners.set(partnerName, [0]);
                    }
                    partners.get(partnerName)[0] += 1
                }
            });
        });
        return [partners, dishes];
    }

    function displayChart(currReport, type){
        var max;
        var chartjson;
        if(type=="dish"){
            chartjson = getDishChartObject(currReport);
        }else if(type == "timeline"){
            chartjson = getTimelineObject(currReport);
        }else if(type == "revenue"){
            chartjson = getRevenueObject(currReport);
        }else{
            chartjson = getPartnerObject(currReport);
        }
        max = chartjson.max;

        //chart colors
        var colors = [];
        for(let i = 0; i< chartjson.data.length * 2; i++){
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            var color = "rgb(" + r + "," + g + "," + b + ")";
            colors.push(color);
        }
        
        
        var chart = document.createElement('div');
        chart.className = "chart";
        var barchart = document.createElement('table');
        barchart.className = "center";
        var titlerow = document.createElement('tr');
        var titledata = document.createElement('td');
        titledata.setAttribute('colspan', chartjson.data.length + 1);
        titledata.setAttribute('class', 'charttitle');
        titledata.innerText = chartjson.title;
        titlerow.appendChild(titledata);
        barchart.appendChild(titlerow);
        chart.appendChild(barchart);
        var barrow = document.createElement('tr');
        for (var i = 0; i < chartjson.data.length; i++) {
            // if(chartjson.data[i][chartjson.ykey] ==0){
            //     continue;
            // }
            barrow.setAttribute('class', 'bars');
            var bardata = document.createElement('td');
            var bar = document.createElement('div');
            bar.style.background = colors[i];
            bar.style.height = chartjson.data[i][chartjson.ykey]/max*100+"%";
            bar.style.width = 20/chartjson.data.length+"rem";
            bardata.innerText = chartjson.data[i][chartjson.ykey];
            bardata.appendChild(bar);
            barrow.appendChild(bardata);
        }
        
        var legendrow = document.createElement('tr');
        var legend = document.createElement('td');
        legend.setAttribute('class', 'legend');
        legend.setAttribute('colspan', chartjson.data.length);
        
        for (var i = 0; i < chartjson.data.length; i++) {
            // if(chartjson.data[i][chartjson.ykey] ==0){
            //     continue;
            // }
            var legbox = document.createElement('span');
            legbox.setAttribute('class', 'legbox');
            var barname = document.createElement('span');
            barname.setAttribute('class','xaxisname');
            barname.style.background = colors[i];
            var bartext = document.createElement('span');
            bartext.innerText = chartjson.data[i][chartjson.xkey];
            legbox.appendChild(barname);
            legbox.appendChild(bartext);
            legend.appendChild(legbox);
        }
        barrow.appendChild(legend);
        barchart.appendChild(barrow);
        barchart.appendChild(legendrow);
        chart.appendChild(barchart);
        currReport.style.display = "none";                                                                                          
        return chart;
    }

    function generateDishSum(partners, dishes, id, filter, sort, currReport){
        let row = document.createElement("row");
        row.className = "row";
        row.setAttribute("id", id);
        let col1 = document.createElement("col");
        col1.setAttribute("id", "selectionRow"+id); 
        col1.className = "column";

        inputCheckBox(partners, col1, id, filter, sort, currReport);

        let col2 = document.createElement("col");
        col2.setAttribute("id", "dishRow"+id); 
        col2.className = "column";
        table = document.createElement("table");
        table.className = "dishS";
        tbody = document.createElement("tbody");

        inputDishesTable(dishes, tbody, id, currReport);
        table.appendChild(tbody);
        col2.appendChild(table);
        row.appendChild(col1);
        row.appendChild(col2);

        return row;
    }

    function filterPartner(id, currReport){
        const partners = new Map();
        const dishes = new Map();
        var checked = document.querySelectorAll('input[type="checkbox"]:checked');
        selected = Array.from(checked).map(x => x.value)
        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            const tipId = "#order"+orderId+"tip";
            const partnerName = currReport.querySelector(tipId).querySelector(".subtotal").innerHTML;
            Array.from(currReport.children).forEach((child) =>{
                if(child.id.includes("order"+orderId+"dish") && selected.includes(partnerName)){
                    const dishName = child.children[0].innerHTML;
                    const price = parseFloat(child.children[1].innerHTML.substring(1));
                    const count = parseInt(child.lastChild.innerHTML);
                    if(!dishes.has(dishName)){
                        dishes.set(dishName, [0, 0]);
                    }
                    dishes.get(dishName)[0] = price;
                    dishes.get(dishName)[1] += count;
                    
                    if(!partners.has(partnerName)){
                        partners.set(partnerName, [0]);
                    }
                    partners.get(partnerName)[0] += 1
                }
            });
        });
        const dishId = "dishRow" + id;
        let dishSum = document.querySelector("#"+id);
        dishSum.removeChild(dishSum.querySelector("#"+dishId));
        let col2 = document.createElement("col");
        col2.setAttribute("id", "dishRow"+id); 
        col2.className = "column";
        table = document.createElement("table");
        table.className = "dishS";
        tbody = document.createElement("tbody");

        inputDishesTable(dishes, tbody, id, currReport);
        table.appendChild(tbody);
        col2.appendChild(table);
        dishSum.append(col2);

    }

    function getTimelineObject(currReport){
        var chartjson = {
            "title": "Bar Chart of Timeline Count",
            "data": [

            ],
            "ykey": 'count',
            "xkey": "time",
            "max": 0
        }
        for(let i=8; i<=21; i++){
            var tmp = {};
            tmp.time = i;
            tmp.count = 0;
            chartjson.data.push(tmp);
        }
        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            

                    
            const timeId = "#order"+orderId+"time";
            const time = currReport.querySelector(timeId).querySelector(".price").innerHTML;
            const hour = time.split(':')[0];
            chartjson.data[hour-1].count += 1;
        });
        var max = 0;
        chartjson.data.forEach((value) => {
            if(max < value.count){
                max = value.count;
            }
        });
        chartjson.max = max
        return chartjson;
    }

    function getRevenueObject(currReport){
        var chartjson = {
            "title": "Bar Chart of Timeline Revenue($)",
            "data": [

            ],
            "ykey": 'count',
            "xkey": "time",
            "max": 0
        }
        for(let i=8; i<=21; i++){
            var tmp = {};
            tmp.time = i;
            tmp.count = 0;
            chartjson.data.push(tmp);
        }
        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            Array.from(currReport.children).forEach((child) =>{
                if(child.id.includes("order"+orderId+"dish")){
                    const id = "#noSubTotal"+orderId;
                    const totalHtml = currReport.querySelector(id).querySelectorAll(".subtotal")[1].innerHTML;
                    console.log(totalHtml)
                    const total = parseFloat(totalHtml.slice(1));
                    const timeId = "#order"+orderId+"time";
                    const time = currReport.querySelector(timeId).querySelector(".price").innerHTML;
                    const hour = time.split(':')[0];
                    chartjson.data[hour-1].count += total;
                }
            });

        });
        var max = 0;
        chartjson.data.forEach((value) => {
            
            if(max < value.count){
                max = value.count;
            }
        });
        chartjson.max = max
        return chartjson;
    }

    function getPartnerObject(currReport){
        var chartjson = {
            "title": "Bar Chart of Partner Popularity",
            "data": [],
            "ykey": 'count',
            "xkey": "name",
            "max": 0
        }
        const partners = new Map();
        const dishes = new Map();
        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            Array.from(currReport.children).forEach((child) =>{
                if(child.id.includes("order"+orderId+"dish")){
                    const dishName = child.children[0].innerHTML;
                    const price = parseFloat(child.children[1].innerHTML.substring(1));
                    const count = parseInt(child.lastChild.innerHTML);
                    if(!dishes.has(dishName)){
                        dishes.set(dishName, [0, 0]);
                    }
                    dishes.get(dishName)[0] = price;
                    dishes.get(dishName)[1] += count;
                    
                    const tipId = "#order"+orderId+"tip";
                    const partnerName = currReport.querySelector(tipId).querySelector(".subtotal").innerHTML;
                    if(!partners.has(partnerName)){
                        partners.set(partnerName, [0]);
                    }
                    partners.get(partnerName)[0] += 1
                }
            });
        });
        var max =0;
        partners.forEach((value, key) => {
            if(max < value[0]){
                max = value[0]
            }
            var tmp = {};
            tmp.name = key;
            tmp.count = value[0];
            chartjson.data.push(tmp);
        });
        chartjson.max = max;
        return chartjson;
    }

    function getDishChartObject(currReport){
        var chartjson = {
            "title": "Bar Chart of Dishes Count",
            "data": [],
            "ykey": 'count',
            "xkey": "name",
            "max": 0
        }
        const partners = new Map();
        const dishes = new Map();
        currReport.querySelectorAll(".orderHeader").forEach((order) => {
            const orderId = order.lastChild.id.substring(order.lastChild.id.length - 1);
            Array.from(currReport.children).forEach((child) =>{
                if(child.id.includes("order"+orderId+"dish")){
                    const dishName = child.children[0].innerHTML;
                    const price = parseFloat(child.children[1].innerHTML.substring(1));
                    const count = parseInt(child.lastChild.innerHTML);
                    if(!dishes.has(dishName)){
                        dishes.set(dishName, [0, 0]);
                    }
                    dishes.get(dishName)[0] = price;
                    dishes.get(dishName)[1] += count;
                    
                    const tipId = "#order"+orderId+"tip";
                    const partnerName = currReport.querySelector(tipId).querySelector(".subtotal").innerHTML;
                    if(!partners.has(partnerName)){
                        partners.set(partnerName, [0]);
                    }
                    partners.get(partnerName)[0] += 1
                }
            });
        });
        var max = 0;
        dishes.forEach((value, key) => {
            if(max < value[1]){
                max = value[1]
            }
            var tmp = {};
            tmp.name = key;
            tmp.count = value[1];
            chartjson.data.push(tmp);
        });
        chartjson.max = max
        return chartjson;
    }

    function sortOption(id, currReport){
        const select = document.querySelector("#"+id).querySelector("#select"+id);
        const option = select[0].options[select[0].selectedIndex].value;
        //get the dish map of the current
        const dishes = new Map();
        const dishId = "dishRow" + id;
        const currDish = document.querySelector("#"+id).querySelector("#"+dishId);
        Array.from(currDish.firstChild.firstChild.children).forEach((child) =>{
            if(child.querySelectorAll(".dishName").length >= 1){
                const dishName = child.querySelector(".dishName").innerHTML;
                const price = parseFloat(child.querySelector(".dishPrice").innerHTML.substring(1));
                const count = parseInt(child.querySelector(".dishCount").innerHTML);
                if(!dishes.has(dishName)){
                    dishes.set(dishName, [0, 0]);
                }
                dishes.get(dishName)[0] = price;
                dishes.get(dishName)[1] += count;
            }
        });
        console.log(dishes);
        //update dishes map
        if(option == "Order Count" + "&uarr;"){
            var new_dishes = new Map([...dishes.entries()].sort((a, b) => b[1][1] - a[1][1]));
        }else if(option == "Order Count" + "&darr;"){
            var new_dishes = new Map([...dishes.entries()].sort((a, b) => a[1][1] - b[1][1]));
        }else if(option == "Price&uarr;"){
            var new_dishes = new Map([...dishes.entries()].sort((a, b) => b[1][0] - a[1][0]));
        }else if(option == "Price&darr;"){
            var new_dishes = new Map([...dishes.entries()].sort((a, b) => a[1][0] - b[1][0]));
        }else if(option == "Name (A-Z)" + "&uarr;"){
            var new_dishes = new Map([...dishes.entries()].reverse());
        }else if(option == "Name (A-Z)" + "&darr;"){
            var new_dishes = new Map([...dishes.entries()].sort());
        }else{
            console.log("Invalid Option");
            return;
        }
        
        let dishSum = document.querySelector("#"+id);
        dishSum.removeChild(dishSum.querySelector("#"+dishId));
        let col2 = document.createElement("col");
        col2.setAttribute("id", "dishRow"+id); 
        col2.className = "column";
        table = document.createElement("table");
        table.className = "dishS";
        tbody = document.createElement("tbody");

        inputDishesTable(new_dishes, tbody, id, currReport);
        table.appendChild(tbody);
        col2.appendChild(table);
        dishSum.append(col2);
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
            //find the orders that belong to one date
            var dates = [];
            data["orders"].forEach((order) =>{
                if(!dates.includes(order.date)){
                    dates.push(order.date)
                }
            });
            var i = 1;
            dates.forEach((date)=>{
                if(i==1){
                    addReportTitle(data, table, date, true);
                    i=0;
                }
                else{
                    addReportTitle(data, table, date, false);
                }
                for(let i = 0; i < data["orders"].length; i++){
                    addOneOrder(data["orders"][i], table, sub, date, true);
                }
                addRevenue(data, table, date);
            });
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
                    var date = document.getElementById("order"+editId).parentNode.className;
                    editOrderDetail(currReport, editId, orderArea, editContent, current, date);
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
            let dates = currReport.querySelectorAll("#resDate");
            dates.forEach(date => {
                console.log(date.innerHTML.split('<')[0]);
                if (date.innerHTML.split('<')[0] == data.date){
                    //find the orders for current date
                    var dateClass = data.date.replaceAll(',', '');
                    var dateClass = dateClass.replaceAll(' ', '');
                    var dateClass = "d"+dateClass;
                    var currDateDiv = currReport.querySelectorAll("."+dateClass);
                    var currDateDiv = currDateDiv[currDateDiv.length-1];
                    var nextDiv = currDateDiv.nextSibling;

                    // currReport.removeChild(currReport.lastChild);
                    addOneOrder(data, currDateDiv, true, data.date, false);
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
                    td2.innerHTML = "$" + findRevenueByDate(currReport, data.date, false);
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    nextDiv.parentNode.insertBefore(tr, nextDiv);
                    currReport.removeChild(nextDiv);
                }
            });

            
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
                var date = document.getElementById("order"+orderId).parentNode.className;
                // newDish.setAttribute("id", "order"+orderId+"dish"+dishId);
                let newDish = addOneDish(data, orderId, dishId, date);
                currReport.insertBefore(newDish, tipBody)

                
                let total = findTotal(currReport, orderId);
                currReport.querySelector("#noSubTotal"+orderId).children[1].innerHTML = "$" + total;
                let revenue = findRevenueByDate(currReport, date, true);
                
                var currDateDiv = currReport.querySelectorAll("."+date);
                var currDateDiv = currDateDiv[currDateDiv.length-1];
                var nextDiv = currDateDiv.nextSibling;
                nextDiv.lastChild.innerHTML = "$" + revenue;
            }
        },

        removeOrder: function(reportId, orderId){
            //check for valid input
            if(document.getElementById(reportId) == null) {
                console.log("The input element does not exist");
                return;
            } else if(document.getElementById(reportId).className != "reportTable"){
                console.log("The input element is not a report");
                return;
            }
            let currReport = document.getElementById(reportId);
            //find if currReport contains editId
            if(currReport.querySelector("#order"+orderId) == null){
                console.log("The input order does not exist");
                return;
            }

            const element = currReport.querySelector("#order"+orderId).parentNode.previousSibling;
            let currOrder = currReport.querySelector("#order"+orderId).parentNode;
            let date = currOrder.className;
            let orderList = currReport.querySelectorAll("."+date);
            let dishId = "order"+orderId+"dish";
            let count = 0;
            Array.from(orderList).forEach(order => {
                if(order.id.includes(dishId)){
                    count += 1;
                }
            });
            for(let i=0; i<5+count; i++){
                currReport.removeChild(element.nextSibling);
            }
            currReport.removeChild(element);

            //update total and revenue
            let revenue = findRevenueByDate(currReport, date, true);
                
            var currDateDiv = currReport.querySelectorAll("."+date);
            var currDateDiv = currDateDiv[currDateDiv.length-1];
            var nextDiv = currDateDiv.nextSibling;
            nextDiv.lastChild.innerHTML = "$" + revenue;
        },

        removeDish: function(reportId, orderId, editDish){
            //check for valid input
            if(document.getElementById(reportId) == null) {
                console.log("The input element does not exist");
                return;
            } else if(document.getElementById(reportId).className != "reportTable"){
                console.log("The input element is not a report");
                return;
            }
            let currReport = document.getElementById(reportId);

            //find if currReport contains editId
            if(currReport.querySelector("#order"+orderId) == null){
                console.log("The input order does not exist");
                return;
            }
            let currOrder = currReport.querySelector("#order"+orderId).parentNode;
            let date = currOrder.className;
            let orderList = currReport.querySelectorAll("."+date);
            let dishId = "order"+orderId+"dish";
            let count = 0;
            Array.from(orderList).forEach(order => {
                if(order.id.includes(dishId)){
                    count += 1;
                    if(order.firstChild.innerHTML == editDish){
                        //remove dish 
                        currReport.removeChild(order);
                        count -= 1;
                    }
                }
            });
            //check if order only contain this one dish
            if(count == 0){
                //remove the whole order
                const element = currReport.querySelector("#order"+orderId).parentNode.previousSibling;
                
                for(let i=0; i<5; i++){
                    currReport.removeChild(element.nextSibling);
                }
                currReport.removeChild(element);

            }else{
                let total = findTotal(currReport, orderId);
                currReport.querySelector("#noSubTotal"+orderId).children[1].innerHTML = "$" + total;
            }
            //update total and revenue
            let revenue = findRevenueByDate(currReport, date, true);
                
            var currDateDiv = currReport.querySelectorAll("."+date);
            var currDateDiv = currDateDiv[currDateDiv.length-1];
            var nextDiv = currDateDiv.nextSibling;
            nextDiv.lastChild.innerHTML = "$" + revenue;
        },

        exportChart: function(reportId, objectType){
            //check for valid input
            if(document.getElementById(reportId) == null) {
                console.log("The input element does not exist");
                return;
            } else if(document.getElementById(reportId).className != "reportTable"){
                console.log("The input element is not a report");
                return;
            }
            let currReport = document.getElementById(reportId);

            if(objectType == "dish"){
                return displayChart(currReport, "dish");
            }
            else if(objectType == "timeline"){
                return displayChart(currReport, "timeline");
            }
            else if(objectType == "partner"){
                displayChart(currReport, "partner");
            }
            else if(objectType == "revenue"){
                displayChart(currReport, "revenue");
            }
            else if(objectType == "all"){
                //give user flexible selection options
                var div = document.createElement("div");
                var values = ["dish chart", "timeline chart", "partner chart", "revenue chart"];
 
                var select = document.createElement("select");
                select.name = "charts";
                select.id = "charts";
            
                for (const val of values){
                    var option = document.createElement("option");
                    option.value = val;
                    option.text = val.charAt(0).toUpperCase() + val.slice(1);
                    select.appendChild(option);
                }
            
                var label = document.createElement("label");
                label.innerHTML = "Choose your chart option: "
                label.htmlFor = "charts";
                div.appendChild(label);
                div.appendChild(select);

                select.onchange = function(){
                    selectChart(currReport);
                };
                currReport.style.display = "none";     
                return div;
            }
            else{
                console.log("object type is not recognized");
            }
        },

        exportReport: function(reportId, toObject, objectType, param){
            //check for valid input
            if(document.getElementById(reportId) == null) {
                console.log("The input element does not exist");
                return;
            } else if(document.getElementById(reportId).className != "reportTable"){
                console.log("The input element is not a report");
                return;
            }
            let currReport = document.getElementById(reportId);
            //return a order object
            if(objectType == "chart"){
                if(toObject){
                    //return chart object
                    return getDishChartObject(currReport);
                }else{
                    //toDom
                    var chartjson = getDishChartObject(currReport);
                    var max = chartjson.max;

                    //chart colors
                    var colors = [];
                    for(let i = 0; i< chartjson.data.length * 2; i++){
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        var color = "rgb(" + r + "," + g + "," + b + ")";
                        colors.push(color);
                    }
                    
                    
                    var chart = document.createElement('div');
                    chart.className = "chart";
                    var barchart = document.createElement('table');
                    barchart.className = "center";
                    var titlerow = document.createElement('tr');
                    var titledata = document.createElement('td');
                    titledata.setAttribute('colspan', chartjson.data.length + 1);
                    titledata.setAttribute('class', 'charttitle');
                    titledata.innerText = chartjson.title;
                    titlerow.appendChild(titledata);
                    barchart.appendChild(titlerow);
                    chart.appendChild(barchart);
                    var barrow = document.createElement('tr');
                    for (var i = 0; i < chartjson.data.length; i++) {
                        barrow.setAttribute('class', 'bars');
                        var bardata = document.createElement('td');
                        var bar = document.createElement('div');
                        bar.style.background = colors[i];
                        bar.style.height = chartjson.data[i][chartjson.ykey]/max*100+"%";
                        bar.style.width = 20/chartjson.data.length+"rem";
                        bardata.innerText = chartjson.data[i][chartjson.ykey];
                        bardata.appendChild(bar);
                        barrow.appendChild(bardata);
                    }
                    
                    var legendrow = document.createElement('tr');
                    var legend = document.createElement('td');
                    legend.setAttribute('class', 'legend');
                    legend.setAttribute('colspan', chartjson.data.length);
                    
                    for (var i = 0; i < chartjson.data.length; i++) {
                        var legbox = document.createElement('span');
                        legbox.setAttribute('class', 'legbox');
                        var barname = document.createElement('span');
                        barname.setAttribute('class','xaxisname');
                        barname.style.background = colors[i];
                        var bartext = document.createElement('span');
                        bartext.innerText = chartjson.data[i][chartjson.xkey];
                        legbox.appendChild(barname);
                        legbox.appendChild(bartext);
                        legend.appendChild(legbox);
                    }
                    barrow.appendChild(legend);
                    barchart.appendChild(barrow);
                    barchart.appendChild(legendrow);
                    chart.appendChild(barchart);
                    currReport.style.display = "none";
                    return chart;
                }

            }else if(objectType == "dish"){
                if(toObject){
                    //return OS object
                    return orderSummaryToDishes(currReport);
                    
                }else{
                    //to Dom
                    const id = param[0];
                    const filter = param[1];
                    const sort = param[2]; 
                    const dish_object = orderSummaryToDishes(currReport)
                    const partners = dish_object[0];
                    const dishes = dish_object[1];
                    const row = generateDishSum(partners, dishes, id, filter, sort, currReport);
                    //display report none
                    currReport.style.display = "none";
                    return row;
                }


            }else{
                console.log("object type is not recognized");
            }
        },

        generateDishSummary: function(data, id, filter, sort){
            //use data and transform to partners and dishes map
            const partners = new Map();
            const dishes = new Map();

            data["partners"].forEach((partner) => {
                partners.set(partner["name"], [partner["count"]])
            })
            data["dishes"].forEach((dish) => {
                dishes.set(dish["name"], [dish["price"], dish["count"]])
            })
            return generateDishSum(partners, dishes, id, filter, sort);
        },

        multiResReport: function(data, ids, parentId){

            //add tabs nav
            const parent = document.getElementById(parentId);
            let nav = document.createElement("nav");
            nav.classList.add("tab");
            let j = 1;
            data.forEach(resData => {
                let btn = document.createElement("button");
                btn.classList.add("subnavBtn");
                if(j==1){
                    btn.classList.add("active-btn");
                }
                btn.setAttribute("data-tab", j);
                j += 1;
                btn.innerHTML = resData.title["restaurant"]
                nav.appendChild(btn);
            });
            parent.appendChild(nav);

            //add tab div
            for(let k = 1; k<= data.length; k++){
                let div = document.createElement("div");
                div.setAttribute("data-tab", k);
                div.setAttribute("id", ids[k-1]+"Con");
                div.classList.add("subnavDiv");
                if(k==1){
                    div.classList.add("active");
                }
                parent.appendChild(div);
            }

            const buttons = document.querySelectorAll('.subnavBtn');
            const divs = document.querySelectorAll('.subnavDiv');
            const handleClick = e => {
                e.preventDefault();
                
                buttons.forEach(node => node.classList.remove('active-btn'));
                e.currentTarget.classList.add('active-btn');
            
                divs.forEach(node => node.classList.remove('active'));
                [...divs].filter(div => div.dataset.tab === e.currentTarget.dataset.tab)[0].classList.add('active');
            }
                
            buttons.forEach(node => node.addEventListener('click', handleClick));
            let i = 0;
            divs.forEach(node => {
                const table = f.generateReport(data[i], ids[i], true);
                document.getElementById(node.id).appendChild(table);
                i+=1;
            });
        }

	}
	global.resTracker = global.resTracker || resTracker

})(window, window.document); 