const exampleData = {
	title: {
		"restaurant": "Pizza Pizza", 
		"date": "March 1, 2022"
	},
	orders: [
        {
            "orderNum": "1",
            "dishes": [{"name": "Small Pepperoni", "price": "25", "count": "3"},
                        {"name": "Small Canadian", "price": "15", "count": "1"}
                    ],
            "tax": "11.7",
            "tip": "10",
            "partner": "DoorDash",
            "time": "10:01:14 AM"
        },
        {
            "orderNum": "2",
            "dishes": [{"name": "Small Pepperoni", "price": "25", "count": "3"},
                        {"name": "Small Hawaiian", "price": "18", "count": "2"}
                    ],
            "tax": "16.2",
            "tip": "15",
            "partner": "Uber Eat",
            "time": "10:02:00 AM"
        },
        {
            "orderNum": "3",
            "dishes": [{"name": "Small Pepperoni", "price": "25", "count": "3"}],
            "tax": "7.5",
            "tip": "0",
            "partner": "Uber Eat",
            "time": "10:05:55 AM"
        }
    ]
}

const f = new resTracker();
function createBS(){
	
	// const table = f.generateReport(exampleData, "report1", false);
	// document.getElementById("example1").appendChild(table)

    const table2 = f.generateReport(exampleData, "report1", true);
	document.getElementById("example1").appendChild(table2)
}

window.addEventListener("load", () =>{
	createBS();
})

