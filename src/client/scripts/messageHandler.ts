import checkText from "./textChecker";
import FormType from "../../server/formEnum";

function handleSubmit(event: Event) {
  event.preventDefault();

  // check what text was put into the form field
  const formInput = (document.getElementById('source-text') as HTMLInputElement)
    .value;
  const formType = checkText(formInput);
  if (formType === FormType.INV) {
    alert('The submitted text is invalid! Please submit a valid text or url!');
  }
  console.log('::: Form Submitted :::');
  fetch('/api/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({input: formInput, type: formType}),
  });
}

document.getElementById('submit')?.addEventListener('click', handleSubmit);
const scoreEl = document.getElementById("score");
const agreement_el = document.getElementById("agreement");
const subjectivity_el = document.getElementById("subjectivity");
const irony_el = document.getElementById("irony");
const confidence_el = document.getElementById("confidence");

new EventSource("/api/messages").onmessage = event => {
  const data = JSON.parse(event.data);
  scoreEl.innerHTML = `Polarity: ${data.score}`;
  agreement_el.innerHTML = `Agreement: ${data.agreement}`;
  subjectivity_el.innerHTML = `Subjectivity: ${data.subjectivity}`;
  irony_el.innerHTML = `Irony: ${data.irony}`;
  confidence_el.innerHTML = `Confidence: ${data.confidence}`;
};
