import { IOTerm, highlight } from 'ioterm';

// websocket
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) {
  console.log("Connection open ...");
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};

// Create a IOTerm and tell it who is its parent element.
var term = new IOTerm(document.getElementById('term'));
// term.setFont({ family: 'monospace', size: '14px' });
term.setPrefix(
    highlight('(base) ') +
    highlight('admin@Puter', 'color: #8ae234') +
    highlight(':') +
    highlight('~', 'color: #729fcf') +
    highlight('$ ')
);

// Here we just write the command back three times if there is no command running. Otherwise, just print the command on console.
term.setCommandHandler((command) => {
  command = command.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  console.log('Commamd:', command);
  if (command === 'end') {
    ws.close();
  } else {
    ws.send(command);
  }
});

term.setTabHandler((inputText, position) => {
    if (inputText) {
        return [
            '<span style="color: #729fcf;">.</span>',
            '<span style="color: #729fcf;">..</span>',
            inputText,
            position,
            '你好',
            'Hello'
        ];
    } else {
        return [];
    }
});

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  term.write(evt.data);
  term.write('\n');
  term.end();
};


var text1 = 'Welcome to IOTerm. IOTerm is a simple front-end terminal component but not as same as a terminal. It is just in charge of <b>Input</b> and <b>Output</b> but do not care about what is the input, what is the output and how the input will be precessed. To make full use of a web page, there are some differences between IOTerm and the terminal we use in a Linux distribution. ';
var text2 = 'If a newline is wanted, please add a line feed "\\n" rather than "\\r\\n", "\\r" or HTML tag "<br>".\n';

term.write(
    highlight(text1) + highlight(text2, 'color: red; font-weight: 600;'));
term.end();
