// commands holds the commands that can be used
const commands = {
    help() {
        terminal.echo(`List of available commands: ${help_list}`);
    },
    echo(...args) {
        terminal.echo(args.join(' '));
    },
    clear() {},
    refresh () {
        this.clear();
        ready()
    },
    ls() {
        terminal.echo(directories);
    }
};

const terminal = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    completion: true
});

// formatter creates a formatted list for the help command
const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});
// command_list is a list of all the keys in the commands variable
const command_list = Object.keys(commands);
const help_list = formatter.format(command_list);

// set the font and load it
const font = 'Star Wars';
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);

// syntax highlighting
const cmd_regex = new RegExp(`^\s*(${command_list.join('|')}) (.*)`);
$.terminal.new_formatter(function(string) {
    return string.replace(cmd_regex, function(_, command, args) {
        return `[[;white;]${command}] [[;aqua;]${args}]`;
    });
});

// set the directories to store information and links
const directories = {
    projects: [
        '',
        '[[;white;]Projects]',
        [
            ['Online Club Management Platform',
             'https://github.com/andrearcaina/vivid',
             'A full-stack web application for a fitness club that enables easy management of the club. It includes user authentication, a messaging platform for all members and administrators, and a membership management system for administration.'
            ]
        ].map(([name, url, description = '']) => {
            return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
        })
    ].flat()
};

// on page ready, show the greeting
function ready() {
    // use the echo function on the text render to make sure the 
    // text remains responsive while resizing page
    terminal.echo(() => {
        const ascii = render("Jack Heintz");
        return `[[;green;]${ascii}]\nWelcome to my website\nType [[b;white;]ls] to get started or [[b;white;]help] to get a list of commands`;
    });
}

// render the text using textSync
function render(text) {
    const cols = terminal.cols();
    return figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    });
}