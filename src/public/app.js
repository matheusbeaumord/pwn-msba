import FoodServices from './services/FoodServices.js';

const addButton = document.getElementById('login--button');

addButton.addEventListener('click', validate);

// Below function Executes on click of login button.
function validate() {
  var attempt = 3; // Variable to count number of attempts.
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  console.log(username);

  if (username == 'Formget' && password == 'formget#123') {
    alert('Login successfully');
    window.location = 'success.html'; // Redirecting to other page.
    return false;
  } else {
    attempt--; // Decrementing by one.
    alert('You have left ' + attempt + ' attempt;');
    // Disabling fields after 3 attempts.
    if (attempt == 0) {
      document.getElementById('username').disabled = true;
      document.getElementById('password').disabled = true;
      document.getElementById('submit').disabled = true;
      return false;
    }
  }
}
