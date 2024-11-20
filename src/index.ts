const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

type TokenResult = {
  token: string;
  result: "accepted" | "rejected";
};

function initializeAutomaton() {
  const states: Array<number> = [];
  const alphabet: Array<string> = ALPHABET.split('');
  const matrix: Array<Record<string, any>> = [{}]

  states.push(0);

  matrix[0] = generateNewState();

  return { matrix, states };
}

function generateNewState() {
  const alphabet: Array<string> = (ALPHABET + 'ε').split('');
  const state: Record<string, any> = {};
  for (const char of alphabet) {
    state[char] = -1;
  }
  return state;
}

function addToken(matrix: Array<Record<string, any>>, states: number[], token: string) {
  let currentState = 0;

  for (const char of token) {
    if (matrix[currentState][char] === -1 || matrix[currentState][char] === undefined) {
      const newState = states.length;
      states.push(newState);
      matrix.push(generateNewState())
      matrix[currentState][char] = newState;
    }

    currentState = matrix[currentState][char];
  }

  if (matrix[currentState] == undefined) matrix.push({})
  matrix[currentState]['ε'] = true;
}

function verifyToken(matrix: Array<Record<string, any>>, token: string) {
  let currentState = 0;

  for (const char of token) {
    if (matrix[currentState][char] === -1) return false;
    document.querySelector(`td.q${currentState}-${char}`)?.classList.add('verifying');
    currentState = matrix[currentState][char]
  }

  const isFinal = matrix[currentState]['ε'] === true
  if (isFinal) document.querySelector(`td.q${currentState}-ε`)?.classList.add('verifying');
  return isFinal;
}

function renderTable(matrix: Array<Record<string, any>>, states: number[]) {
  const tableContainer = document.querySelector('#automaton')
  if (tableContainer) tableContainer.innerHTML = '';

  const table = document.createElement('table');
  table.classList.add('table', 'table-bordered', 'table-striped')

  const tableHead = document.createElement('thead');
  tableHead.classList.add('table-dark')
  const tableHeadingRow = document.createElement('tr');
  const tableColumns = ('ς' + ALPHABET + 'ε').split('').map((char) => {
    const el = document.createElement('th');
    el.scope = 'col';
    el.textContent = char;
    return el;
  })

  for (const heading of tableColumns) {
    tableHeadingRow.appendChild(heading);
  }
  tableHead.appendChild(tableHeadingRow);
  table.appendChild(tableHead);

  const tableBody = document.createElement('tbody');
  const tableRows = matrix.map((line, index) => {
    const tableBodyRow = document.createElement('tr');

    const state = document.createElement('th')
    state.scope = 'row';
    state.textContent = `q${index}`;
    tableBodyRow.appendChild(state);

    for (const [key, value] of Object.entries(line)) {
      const tableColumn = document.createElement('td');
      tableColumn.textContent = value !== -1 ? (value === true ? 'true' : `q${value}`) : '-';
      tableColumn.classList.add(`q${index}-${key}`)
      tableBodyRow.appendChild(tableColumn);
    }

    return tableBodyRow;
  })
  tableRows.forEach(row => tableBody.appendChild(row));
  table.appendChild(tableBody);


  tableContainer?.appendChild(table);
}

(function () {
  const { matrix, states } = initializeAutomaton();
  const tokenInput = document.querySelector('#token-input');
  const tokenVerify = document.querySelector('#token-verify');
  const result = document.querySelector('#result');
  const tokens: Array<TokenResult> = [];

  renderTable(matrix, states);

  tokenInput?.addEventListener('input', function (e: any) {
    const { value } = e.target;

    const newValue = value
      .toLowerCase()
      .replace(/[^\w]/, '')
      .replace(/[0-9]/, '');

    e.target.value = newValue;
  });

  tokenVerify?.addEventListener('input', function (e: any) {
    const { value } = e.target;

    const newValue = value
      .toLowerCase()
      .replace(/[^\w]/, '')
      .replace(/[0-9]/, '');

    e.target.value = newValue;

    renderTable(matrix, states);
    if (verifyToken(matrix, newValue)) {
      result!.textContent = `Token ${newValue} reconhecido`
    } else {
      result!.textContent = `Token ${newValue} não reconhecido`
    }
  });

  tokenInput?.addEventListener('keydown', function (e: any) {
    if (e.keyCode == 32 || e.keyCode == 13) {
      const token = e.target.value
      addToken(matrix, states, token);
      renderTable(matrix, states);
      e.target.value = '';
    }
  });

  tokenVerify?.addEventListener('keydown', function (e: any) {
    if (e.keyCode == 32 || e.keyCode == 13) {
      const { value } = e.target;
      
      if (verifyToken(matrix, value)) {
        tokens.push({token: value, result: 'accepted'});
      } else {
        tokens.push({token: value, result: 'rejected'});
      }

      console.log(tokens);

      e.target.value = '';
      result!.textContent = '';
      renderTable(matrix, states);
    }
  });

})()
