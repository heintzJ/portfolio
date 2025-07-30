const root = '~';
// current working directory
let cwd = root;

const user = 'user';
const server = 'jackHeintz';

// set the directories to store information and links
const directories = {
    about: [
        '',
        '[[;white;;txt]about.txt]',
        ''
    ],
    projects: [
        '',
        '[[;white;;txt]projects.txt]',
        ''
    ].flat(),
    education: [
        '',
        '[[;white;;txt]education.txt]',
        ''
    ]
};

const files = {
    about: [
        '',
        'Hello! My name is Jack Heintz and I am a Computer Science student at Toronto\nMetropolitan University. I am looking for Co Op opportunites for the Winter\nsemester, and have been working as a DevOps intern and a Farmhand on weekends.\nDuring my free time I love to read, go for runs, spend time outside, and\ndevelop programming projects. I am interested in DevOps and web development.',
        ''
    ],
    projects: [
        '',
        [
            ['Online Club Management Platform',
             'https://github.com/andrearcaina/vivid',
             'A full-stack web application for a fitness club that enables\na messaging platform for all members and administrators,\nand a membership management system for administration. Created with 4 other group members.'
            ],
    
            ['Websites for CPS530',
             'https://github.com/heintzJ/CPS530-Labs',
             'A collection of labs for a web development course I took at TMU.\nLanguages used are HTML, CSS, JavaScript, Python, PHP, Perl, Ruby, and MySQL'
            ],

            ['Audio Application Simulator',
             'https://github.com/heintzJ/CPS209-A1',
             'This project simulates the experience of an audio listening application, such as\nSpotify or Apple Music. It supports, music, podcasts, and audiobooks, with each\ntype of audio having its own class and methods. It also supports a playlist\nfeature, which songs and podcasts can be added to.'
            ],

            ['Custom Linked List in C',
             'https://github.com/heintzJ/LinkedList-in-C',
             'My attempt on a linked list structure written in C. It supports addition, deletion, and getter methods.'
            ],

            ['ARC Assembly to Machine Code Translator',
             'https://github.com/heintzJ/Machine-Coder',
             'This is a Java Swing program that takes in an ARC Assembly instruction in a GUI\nand produces the corresponding machine code that the processor would use.'
            ]
        ].map(([name, url, description = '']) => {
            return `[[;white;]${name}]\n${url}\n${description}\n`;
        }),
    ].flat(),
    education: [
        '',
        [
            'Toronto Metropolitan University (2022-Present)\nGPA: 3.97/4.33\nRelevant courses: Operating Systems, C/Linux, Web Development, Python, Data Structures, Communications',
        ],
        ''
    ]
}

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
                print_dirs();
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
            this.echo('Type [[;white;]cat <file name>] or click on the file name to see the contexts of a file.')
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
        // if the user uses ../ to go to root and then to directory in one line
        else if (dir.startsWith('../') && `${dir.substring(3)}` in directories) {
            cwd = `~/${dir.substring(3)}`;
        }
        // if the dest is under the current directory
        else if (`${dir}` in directories) {
            terminal.echo("------\nType [[;white;]ls] to view contents\n------");
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    cat(file = null) {
        if (file !== null) {
            fname = file.substring(0, file.length - 4);
            if (fname in files) {
                print_file(fname);
            } else {
                terminal.error('File does not exist')
            }
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
            // if using ../dir
            else if (rest.startsWith('../')) {
                return Object.keys(directories).map(dir => `../${dir}`);
            }
            // if we are in the root, return an array of suggestions within the root level
            if (cwd === root) {
                return Object.keys(directories);
            }
        } else if (name === 'cat') {
            return Object.keys(files).map(file => `${file}.txt`);
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
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts' });
figlet.preloadFonts([font], ready);

// syntax highlighting
const cmd_regex = new RegExp(`^\s*(${command_list.join('|')}) (.*)`);
$.terminal.new_formatter(function(string) {
    return string.replace(cmd_regex, function(_, command, args) {
        return `[[;white;]${command}] [[;aqua;]${args}]`;
    });
});

function prompt() {
    return `[[;#44D544;]${user}@${server}]:[[;#55F;]${cwd}]$ `;
}

// on page ready, show the greeting
function ready() {
    // use the echo function on the text render to make sure the 
    // text remains responsive while resizing page
    terminal.echo(() => {
        const ascii = render("Jack Heintz");
        return `[[;#44D544;]${ascii}]\nWelcome to my website\nType [[b;white;]ls] to get started or [[b;white;]help] to get a list of commands. Tab completion is supported!`;
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

function print_file(file) {
    terminal.echo(files[file]);
}

terminal.on('click', '.dir', function() {
    const dir = $(this).text();
    terminal.exec(`cd ${dir}`);
});

terminal.on('click', '.txt', function() {
    const file = $(this).text();
    terminal.exec(`cat ${file}`);
});