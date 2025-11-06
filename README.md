This is a frontend site built with [Lit](https://lit.dev/) and [Tumblr](https://www.tumblr.com/).

This is intended to be an outlet for me to post about my family, climbing adventures, whatever I happen to be watching, and anything else that may cross my mind that I want to put into words.

If you're interested in the code, I think the most notable bit is the "observe" decorator. I find it makes interacting with [rxjs](https://rxjs.dev/) observables from a Lit web component a breeze. Check it out:
* [Implementation](https://github.com/defevan/dadmaxxing/blob/master/src/lib/observe-decorator.ts)
* [Usage](https://github.com/defevan/dadmaxxing/blob/master/src/components/header.ts)

Take care,

Evan