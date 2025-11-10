This is a frontend site built with [Lit](https://lit.dev/) and [Tumblr](https://www.tumblr.com/).

This is intended to be an outlet for me to post about my family, climbing adventures, whatever I happen to be watching, and anything else that may cross my mind that I want to put into words.

~~If you're interested in the code, I think the most notable bit is the "observe" decorator. I find it makes interacting with [rxjs](https://rxjs.dev/) observables from a Lit web component a breeze. Check it out:~~
* [Implementation](https://github.com/defevan/dadmaxxing/blob/fccb83ad9c5a725bbbfbaa5199e429a85cd39b58/src/lib/observe-decorator.ts)
* [Usage](https://github.com/defevan/dadmaxxing/blob/fccb83ad9c5a725bbbfbaa5199e429a85cd39b58/src/components/header.ts)

I've since removed all rxjs usage in favor of [signals](https://github.com/tc39/proposal-signals). The links above still point to commits that show the observe decorator.

Take care,

Evan