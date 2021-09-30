let data = {
  user: {},
  accounts: [],
  loginStatus: false,
};

let fields = {
  user: ["firstName", "lastName"],
  account: ["alias", "accountNo", "balance"],
};

(function () {
  "use strict";
  document
    .getElementById("editProfileButton")
    .addEventListener("click", populateEditUser);

  // document
  //   .getElementById("inputCIF")
  //   .addEventListener("focusOut", form.checkValidity());
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {
          if (event.target.id == "loginForm") {
            data.user.customerId = document.getElementById("inputCif").value;
            getInitialData();
          } else if (event.target.id == "depositForm") {
            depositAmount(event.submitter.dataset.type);
          }
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

async function getInitialData() {
  const userObj = {
    method: "get",
    url: "http://localhost:8086/api/parties/customers/" + data.user.customerId,
    headers: {},
    data: {},
  };
  await fetchAPI(userObj, "user");
  if (data.loginStatus) {
    const accountObj = {
      method: "get",
      url:
        "http://localhost:8087/api/products/accounts/customer/" +
        data.user.customerId,
      headers: {},
      data: {},
    };
    await fetchAPI(accountObj, "accounts");
    console.log(data);
    displayData();
    displayAccount();
  } else {
    loginFailed();
  }
}

function loginFailed() {
  // document.getElementById("inputCif").classList.add("is-invalid");
}

async function fetchAPI(obj, section) {
  try {
    const response = await axios(obj);
    data[section] = response.data;
    data.loginStatus = true;
    console.log(data);
  } catch (error) {
    data.loginStatus = false;
    console.error(error);
  }
}

function displayData() {
  data.user ? setInnerHTML("user") : "";
  // data.account ? setInnerHTML("account") : "";
  togglePage("loginPage", "dashPage");
}
function displayAccount() {
  let accounts = data.accounts;
  let accountSection = "";
  if (accounts.length > 0) {
    for (let account of accounts) {
      accountSection += `
    <div class="row accountRow" id="">
      <div class="col-5">
        <h5>${account.alias}</h5>
        <h6>${account.accountNo}</h6>
      </div>
      <div class="col-4">
        $ <span style="font-size: 26px;" id="accountBalance${account.accountNo}">${account.balance}</span>
      </div>
      <div class="col-3">
        <button
          type="button"
          class="btn btn-link depositMoneyButton"
          data-bs-toggle="modal"
          data-bs-target="#depositMoney"
          data-bs-alias="${account.alias}"
          data-bs-accountid="${account.accountNo}"
        >
        <img src="./img/transaction-icon.png"/>
        </button>
      </div>
    </div>`;
    }
  } else {
    accountSection = " No Accounts!";
  }
  document.getElementById("accountSection").innerHTML = accountSection;
  // var transactionButtons =
  //   document.getElementsByClassName("depositMoneyButton");

  // for (var i = 0; i < transactionButtons.length; i++) {
  //   transactionButtons[i].addEventListener("click", addAccountDetails, false);
  // }
}
var depositMoney = document.getElementById("depositMoney");
depositMoney.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  var accountAlias = button.getAttribute("data-bs-alias");
  var accountId = button.getAttribute("data-bs-accountid");
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  var modalTitle = depositMoney.querySelector(".modal-title");
  var modalAccountInput = depositMoney.querySelector("#inputAccount");
  depositMoney.querySelector("#inputAmount").value = 100.0;
  modalTitle.textContent = accountAlias;
  modalAccountInput.value = accountId;
});

function togglePage(currentpage, newPage) {
  document.getElementById(currentpage).style.display = "none";
  document.getElementById(newPage).style.display = "block";
}

function populateEditUser() {
  document.getElementById("inputFirstName").value = data.user.firstName;
  document.getElementById("inputLastName").value = data.user.lastName;
}

var depositModal = new bootstrap.Modal(document.getElementById("depositMoney"));

async function depositAmount(type) {
  let accountID = document.getElementById("inputAccount").value;
  const depositObj = {
    method: "patch",
    url: "http://localhost:8087/api/products/accounts/" + accountID,
    headers: {},
    data: {
      command: type,
      amount: document.getElementById("inputAmount").value,
    },
  };
  console.log("----", depositObj);
  await fetchAPI(depositObj, "account");
  document.getElementById("accountBalance" + accountID).innerHTML =
    data.account.balance;

  // console.log(">>>>>>>>>", depositModal);
  depositModal.hide();
}

function setInnerHTML(section) {
  var fieldArray = fields[section];
  var dataObj = data[section];
  for (let i = 0; i < fieldArray.length; i++) {
    document.getElementById(fieldArray[i]).innerHTML = dataObj[fieldArray[i]];
  }
}
