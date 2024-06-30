let getStarted = document.querySelector(".getStarted");
let CPU = document.querySelector("#CPU");
let DISK = document.querySelector("#DISK");
let IO = document.querySelector("#IO");
let MEMORY = document.querySelector("#MEMORY");
let resourceParameters = document.querySelector(".resourceParameters");
let resourceParameters1 = document.querySelector(".resourceParameters1");
let resourceParameters2 = document.querySelector(".resourceParameters2");
let resourceParameters3 = document.querySelector(".resourceParameters3");
let runExperiment = document.querySelector(".runExperiment");
let ioModes = document.querySelector(".ioModes");
let allocationStrategy = document.querySelector(".allocationStrategy");
let chart = document.getElementById("chart");
let makeChart = document.querySelector(".makeChart");
let loader = document.querySelector("#loader");
let internalTestForm = document.querySelector(".internalTestForm");

let experimentId = "";
let chartApiResponse = {};

getStarted.addEventListener("click", function () {
  console.log("Get Started Button Clicked");

  window.scrollBy({
    top: 920,
    behavior: "smooth",
  });
});

//NOTE : Adding Event listner when we select radio button it should show
//       input fields
CPU.addEventListener("change", function (event) {
  console.log(this.value);
  resourceParameters.classList.remove("hidden");
  resourceParameters2.setAttribute("placeholder", "Capacity");
  resourceParameters3.setAttribute("placeholder", "Cores");

  //Reset input value when we change Radio buttons
  resourceParameters1.value = "";
  resourceParameters2.value = "";
  resourceParameters3.value = "";

  resourceParameters2.classList.remove("hidden");
  resourceParameters3.classList.remove("hidden");
  allocationStrategy.classList.add("hidden");
  ioModes.classList.add("hidden");
});
DISK.addEventListener("change", function (event) {
  console.log(this.value);
  resourceParameters.classList.remove("hidden");
  resourceParameters2.setAttribute("placeholder", "Directory");
  resourceParameters3.setAttribute("placeholder", "Volume");

  //Reset input value when we change Radio buttons
  resourceParameters1.value = "";
  resourceParameters2.value = "";
  resourceParameters3.value = "";

  resourceParameters2.classList.remove("hidden");
  resourceParameters3.classList.remove("hidden");
  allocationStrategy.classList.add("hidden");
  ioModes.classList.add("hidden");
});
IO.addEventListener("change", function (event) {
  console.log(this.value);
  resourceParameters.classList.remove("hidden");
  resourceParameters2.setAttribute("placeholder", "Directory");
  resourceParameters3.setAttribute("placeholder", "Mode");

  //Reset input value when we change Radio buttons
  resourceParameters1.value = "";
  resourceParameters2.value = "";
  resourceParameters3.value = "";

  //Show DropDown for Read write Mode & hide Mode input field
  ioModes.classList.remove("hidden");
  resourceParameters2.classList.remove("hidden");
  resourceParameters3.classList.add("hidden");
  allocationStrategy.classList.add("hidden");
});
MEMORY.addEventListener("change", function (event) {
  console.log(this.value);
  resourceParameters.classList.remove("hidden");
  resourceParameters2.setAttribute("placeholder", "Bring system to amount");
  resourceParameters3.setAttribute("placeholder", "Memory");

  //Reset input value when we change Radio buttons
  resourceParameters1.value = "";
  resourceParameters2.value = "";
  resourceParameters3.value = "";

  resourceParameters2.classList.add("hidden");
  resourceParameters3.classList.remove("hidden");
  allocationStrategy.classList.remove("hidden");
  ioModes.classList.add("hidden");
});

function commandObjectCreater(ClickedRadioButton) {
  console.log(
    `${ClickedRadioButton} radio button is clicked and Its type is ${typeof ClickedRadioButton}`
  );

  // Empty command object so that we can make new command object based on radio button selected
  let command = {};

  switch (ClickedRadioButton) {
    case "CPU":
      console.log("Inside Switch CPU");
      command = {
        type: "cpu",
        commandType: "CPU",
        args: [
          "-l",
          `${resourceParameters1.value}`,
          "-p",
          `${resourceParameters2.value}`,
          "-c",
          `${resourceParameters3.value}`,
        ],
      };
      console.log(command);
      break;
    case "DISK":
      console.log("Inside Switch DISK");
      command = {
        type: "disk",
        commandType: "Disk",
        args: [
          "-l",
          `${resourceParameters1.value}`,
          "-d",
          `${resourceParameters2.value}`,
          "-p",
          `${resourceParameters3.value}`,
          "-w",
          "1",
          "-b",
          "4",
        ],
      };
      console.log(command);
      break;
    case "IO":
      console.log("Inside Switch IO");
      console.log(`Selected IO Modes : ${ioModes.value}`);
      command = {
        type: "io",
        commandType: "IO",
        args: [
          "-l",
          `${resourceParameters1.value}`,
          "-d",
          `${resourceParameters2.value}`,
          "-m",
          `${ioModes.value}`,
          "-w",
          "1",
          "-c",
          "1",
          "-s",
          "4",
        ],
      };
      console.log(command);
      break;
    case "MEMORY":
      console.log("Inside Switch MEMORY");
      console.log(`Selected Allocation strategy : ${allocationStrategy.value}`);
      command = {
        type: "memory",
        commandType: "Memory",
        args: [
          "-l",
          `${resourceParameters1.value}`,
          "-s",
          `${allocationStrategy.value}`,
          "-p",
          `${resourceParameters3.value}`,
        ],
      };
      console.log(command);
      break;

    default:
      break;
  }

  return command;
}

async function showChart() {
  loader.classList.add("hidden");
  chart.classList.remove("hidden");

  const url = `https://api.gremlin.com/v1/metrics/attacks/${experimentId}?teamId=db2c3d5e-06fc-4d65-ac3d-5e06fcbd659d`;
  console.log(` URL : ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer Yy0zZTA5NjE0YS04ZTE1LTVjYjUtYWU4Yy1mMTBiYTJiZDA0YjE6ZHVrZXVzMzQ4QG91dGxvb2suY29tOjAzMWJhNzc4LTA3MGUtNGNlYi05YmE3LTc4MDcwZWJjZWI0OA==",
    },
  });
  const json = await response.json();

  console.log(json.metric_data);

  chart.getContext("2d");
  let chaosChart = new Chart(chart, {
    type: "line",
    data: {
      labels: json.metric_data["10.1.1.4"].map((row) => row.timestamp),
      datasets: [
        { data: json.metric_data["10.1.1.4"].map((row) => row.value) },
      ],
    },
  });

}

runExperiment.addEventListener("click", function () {
  console.log("Run Experiment Button Clicked");

  let ClickedRadioButton = document.querySelector(
    "input[name=Resource]:checked"
  ).value;

  commandObjectCreater(ClickedRadioButton);
  console.log(` Time : ${resourceParameters1.value}`);
  console.log(`Capacity :${resourceParameters2.value}`);
  console.log(`Cores : ${resourceParameters3.value}`);

  console.log(
    ` JSON Stringlfy : ${JSON.stringify(
      commandObjectCreater(ClickedRadioButton)
    )}`
  );

  fetch(
    "https://api.gremlin.com/v1/attacks/new?teamId=db2c3d5e-06fc-4d65-ac3d-5e06fcbd659d",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization:
          "Bearer Yy0zZTA5NjE0YS04ZTE1LTVjYjUtYWU4Yy1mMTBiYTJiZDA0YjE6ZHVrZXVzMzQ4QG91dGxvb2suY29tOjAzMWJhNzc4LTA3MGUtNGNlYi05YmE3LTc4MDcwZWJjZWI0OA==",
      },
      body: JSON.stringify({
        target: {
          hosts: {
            ids: ["10.1.1.4"],
          },
          type: "Exact",
        },
        command: commandObjectCreater(ClickedRadioButton),
        includeNewTargets: true,
      }),
    }
  )
    .then((response) => response.text())
    .then((json) => {
      experimentId = json;
      console.log(`experimentId : ${experimentId}`);
    });

  loader.classList.remove("hidden");
  internalTestForm.style.display = "none";

  const testjson = setTimeout(
    showChart,
    (Number(resourceParameters1.value) + 5) * 1000
  );

  console.log("********* Test Json *********");
  console.log(testjson);
});

