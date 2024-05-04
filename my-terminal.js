// commands holds the commands that can be used
const commands = {
    help() {
        term.echo(`List of available commands: ${help}`);
    },
    echo(...args) {
        term.echo(args.join(' '));
    },
    clear() {},
    refresh () {
        this.clear();
        ready()
    }
};

// formatter creates a formatted list for the help command
const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});
// command_list is a list of all the keys in the commands variable
const command_list = Object.keys(commands);
const help = formatter.format(command_list);

// set the font and load it
const font = 'Star Wars';
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);

const term = $('body').terminal(commands, {
    greetings: false,
    checkArity: false
});

// on page ready, show the greeting
function ready() {
    // use the echo function on the text render to make sure the 
    // text remains responsive while resizing page
    term.echo(() => {
        const ascii = render("Jack Heintz");
        return `[[;green;]${ascii}]\nWelcome to my website\nType [[b;white;]ls] to get started or [[b;white;]help] to get a list of commands`;
    });
}

// render the text using textSync
function render(text) {
    const cols = term.cols();
    return figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    });
}