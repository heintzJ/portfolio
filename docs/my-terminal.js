const root = '~';
// current working directory
let cwd = root;

const user = 'guest';
const server = 'jackHeintz';

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
    ls(dir = null) {
        if (dir) {
            // absolute path
            if (dir.startsWith('~')) {
                // get the "~/" as the root path
                const path = dir.substring(2);
                // turn the string into an array, starting after ~/
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    // dir is the name of the directory after ~/
                    const dir = dirs[0];
                    // retrieve the contents of the directory
                    this.echo(directories[dir].join('\n'));
                }
            }
            // root directory
            else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } 
            // print parent directory
            else if (dir === '..') {
                print_dirs
            }
            else {
                this.error('Invalid directory');
            }
        }
        // if no dir provided and we are in the root directory
        else if (cwd === root) {
            print_dirs();
        }
        // if no dir provided and we are within some other directory
        else {
            const dir = cwd.substring(2); // get rid of ~/
            this.echo(directories[dir].join('\n'));
        }
    },
    cd(dir = null) {
        // send the user to the root directory
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        }
        // if the dest starts with / and is in directories, send the user to dir
        else if (dir.startsWith('~/') && `${dir.substring(2)}` in directories) {
            cwd = dir;
        }
        // if the dest is under the current directory
        else if (`${dir}` in directories) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    }
};

const terminal = $('body').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    completion: true,
    completion(string) {
        // get the current command being typed
        const cmd = this.get_command();
        // name is cmd, rest is arguments
        const {name, rest} = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
            // absolute path - need to prepend ~/ to each suggested completion
            if (rest.startsWith('~/')) {
                return Object.keys(directories).map(dir => `~/${dir}`);
            }
            // if we are in the root, return an array of suggestions within the root level
            if (cwd === root) {
                return Object.keys(directories);
            }
        }
        return Object.keys(commands);
    },
    prompt
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
             'A full-stack web application for a fitness club that enables\na messaging platform for all members and administrators,\nand a membership management system for administration.'
            ]
        ].map(([name, url, description = '']) => {
            return `${url}\n${name}\n[[;white;]${description}]`;
        })
    ].flat()
};

function prompt() {
    return `[[;#44D544;]${user}@${server}]:[[;#55F;]${cwd}]$ `;
}

// on page ready, show the greeting
function ready() {
    // use the echo function on the text render to make sure the 
    // text remains responsive while resizing page
    terminal.echo(() => {
        const ascii = render("Jack Heintz");
        return `[[;#44D544;]${ascii}]\nWelcome to my website\nType [[b;white;]ls] to get started or [[b;white;]help] to get a list of commands`;
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

// print all directories
function print_dirs() {
    terminal.echo("------\nType [[;white;]cd <directory name>] or click on a directory to view its contents\n------")
    for (dir in directories) {
        terminal.echo(`[[;#55F;;dir]${dir}]`);
    }
}

terminal.on('click', '.dir', function() {
    const dir = $(this).text();
    terminal.exec(`cd ~/${dir}`);
});