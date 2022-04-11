const exampleData = {
	title: {
		"restaurant": "Pizza Pizza", 
	},
	orders: [
        {
            "orderNum": "1",
            "date": "1 March, 2022",
            "dishes": [{"name": "Small Pepperoni", "price": "25", "count": "3"},
                        {"name": "Small Canadian", "price": "15", "count": "1"}
                    ],
            "tax": "11.7",
            "tip": "10",
            "partner": "DoorDash",
            "time": "10:01:14"
        },
        {
            "orderNum": "2",
            "date": "1 March, 2022",
            "dishes": [{"name": "Small Pepperoni", "price": "25", "count": "3"},
                        {"name": "Small Hawaiian", "price": "18", "count": "2"}
                    ],
            "tax": "16.2",
            "tip": "15",
            "partner": "Uber Eat",
            "time": "11:02:00"
        },
        {
            "orderNum": "3",
            "date": "1 March, 2022",
            "dishes": [{"name": "Small Pepperoni", "price": "25", "count": "3"}],
            "tax": "7.5",
            "tip": "0",
            "partner": "Uber Eat",
            "time": "12:05:55"
        },
        {
            "orderNum": "4",
            "date": "2 March, 2022",
            "dishes": [{"name": "Small Pepperoni", "price": "25", "count": "3"}],
            "tax": "7.5",
            "tip": "0",
            "partner": "Uber Eat",
            "time": "12:05:55"
        }
    ]
}

const exampleDSData = {
    "partners": [
        {   
            "name": "Skip The Dishes", "count": "1"
        },
        {   
            "name": "Uber Eat", "count": "1"
        },
        {   
            "name": "DoorDash", "count": "1"
        }
    ],
    "dishes": [
        {
            "name": "Small Pepperoni", "price": "25", "count": "9"
        },
        {
            "name": "Large Pepperoni", "price": "35", "count": "2"
        },
        {
            "name": "Small Hawaiian", "price": "18", "count": "2"
        },
        {
            "name": "Small Canadian", "price": "15", "count": "1"
        }
    ]
}

const newOrder = {
    "orderNum": "5",
    "date": "1 March, 2022",
    "dishes": [{"name": "Large Pepperoni", "price": "35", "count": "2"}],
    "tax": "8.75",
    "tip": "5",
    "partner": "Uber Eat",
}

const f = new resTracker();

function showEx1(){
    document.getElementById("ex2b").disabled = false;
    let node = document.getElementById("example2").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex3b").disabled = false;
    node = document.getElementById("example3").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex4b").disabled = false;
    node = document.getElementById("example4").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex5b").disabled = false;
    node = document.getElementById("example5").querySelector("#ds1");
    if(node != null){
        node.remove();
    }


    const table = f.generateReport(exampleData, "report1", true);
	document.getElementById("example1").appendChild(table)
    document.getElementById("ex1b").disabled = true;

}

function showEx2(){
    document.getElementById("ex1b").disabled = false;
    let node = document.getElementById("example1").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex3b").disabled = false;
    node = document.getElementById("example3").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex4b").disabled = false;
    node = document.getElementById("example4").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex5b").disabled = false;
    node = document.getElementById("example5").querySelector("#ds1");
    if(node != null){
        node.remove();
    }


    const table = f.generateReport(exampleData, "report1", true);
	document.getElementById("example2").appendChild(table)

    const editInfo = ["order", 1, ["partner", "Skip The Dishes"]]
    f.editReportDetail("report1", editInfo);

    const editInfo1 = ["title", "date", "2 March, 2022"];
    f.editReportDetail("report1", editInfo1, true);

    const editInfo2 = ["order", 1, ["time", "", true]]
    f.editReportDetail("report1", editInfo2);

    const editInfo3 = ["order", 2, ["time", "12:59:00", false]]
    f.editReportDetail("report1", editInfo3);

    document.getElementById("ex2b").disabled = true;
    
}

function showEx3(){
    document.getElementById("ex1b").disabled = false;
    let node = document.getElementById("example1").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex2b").disabled = false;
    node = document.getElementById("example2").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex4b").disabled = false;
    node = document.getElementById("example4").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex5b").disabled = false;
    node = document.getElementById("example5").querySelector("#ds1");
    if(node != null){
        node.remove();
    }


    const table = f.generateReport(exampleData, "report1", true);
	document.getElementById("example3").appendChild(table)

    const editInfo4 = ["order", 3, ["tip", "10.00"]]
    f.editReportDetail("report1", editInfo4);

    const editInfo5 = ["order", 1, ["dish1", ["Large Pepperoni", "35", "2"]]]
    f.editReportDetail("report1", editInfo5);

    document.getElementById("ex3b").disabled = true;
    
}

function showEx4(){
    document.getElementById("ex1b").disabled = false;
    let node = document.getElementById("example1").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex2b").disabled = false;
    node = document.getElementById("example2").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex3b").disabled = false;
    node = document.getElementById("example3").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex5b").disabled = false;
    node = document.getElementById("example5").querySelector("#ds1");
    if(node != null){
        node.remove();
    }

    const table = f.generateReport(exampleData, "report1", true);
	document.getElementById("example4").appendChild(table)

    f.addOrder(newOrder, "report1", false, true);
    f.addDish({"name": "Small Pepperoni", "price": "25", "count": "3"}, "report1", 5, false);

    document.getElementById("ex4b").disabled = true;
}

function showEx5(){
    document.getElementById("ex1b").disabled = false;
    let node = document.getElementById("example1").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex2b").disabled = false;
    node = document.getElementById("example2").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex3b").disabled = false;
    node = document.getElementById("example3").querySelector("#report1");
    if(node != null){
        node.remove();
    }
    document.getElementById("ex4b").disabled = false;
    node = document.getElementById("example4").querySelector("#report1");
    if(node != null){
        node.remove();
    }


    const table = f.generateDishSummary(exampleDSData, "ds1", true, true);
	document.getElementById("example5").appendChild(table)
    document.getElementById("ex5b").disabled = true;
}

function createBS(){
	
	// const table = f.generateReport(exampleData, "report1", false);
	// document.getElementById("example1").appendChild(table)

    // const table = f.generateReport(exampleData, "report1", true);
	// document.getElementById("example1").appendChild(table)

    // const table2 = f.generateReport(exampleData, "report2", true);
	// document.getElementById("example2").appendChild(table)

    // const editInfo = ["order", 1, ["partner", "Skip The Dishes"]]
    // f.editReportDetail("report1", editInfo);

    // const editInfo1 = ["title", "date", "2 March, 2022"];
    // f.editReportDetail("report1", editInfo1, true);

    // const editInfo2 = ["order", 1, ["time", "", true]]
    // f.editReportDetail("report1", editInfo2);

    // const editInfo3 = ["order", 2, ["time", "12:59:00", false]]
    // f.editReportDetail("report1", editInfo3);

    // const editInfo4 = ["order", 3, ["tip", "10.00"]]
    // f.editReportDetail("report1", editInfo4);

    // const editInfo5 = ["order", 1, ["dish1", ["Large Pepperoni", "35", "2"]]]
    // f.editReportDetail("report1", editInfo5);

    // f.addOrder(newOrder, "report1", false, true);

    // f.addDish({"name": "Small Pepperoni", "price": "25", "count": "3"}, "report1", 4, false);

    // const table = f.generateDishSummary(exampleDSData, "ds1", true, true);
	// document.getElementById("example5").appendChild(table)

    // const table = f.generateReport(exampleData, "report1", true);
	// document.getElementById("example6").appendChild(table)

    // const ds = f.exportReport("report1", false, "chart", ["ds1", true, true]);
    // document.getElementById("example6").appendChild(ds);

    // const chart = f.exportChart("report1", "all"); //default time interval is 8am to 21pm
    // document.getElementById("example6").appendChild(chart);

    const table = f.generateReport(exampleData, "report1", true);
	document.getElementById("example6").appendChild(table)

    // f.removeDish("report1", "1", "Small Canadian");

    // f.removeDish("report1", "3", "Small Pepperoni");

    f.removeOrder("report1", "1");

}

window.addEventListener("load", () =>{
	createBS();
})

