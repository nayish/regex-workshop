# Scala Setup

* Clone this project locally `git clone git@github.com:nayish/regex-workshop.git`
* In Intellij, Select `File` > `Open...` and choose the `build.sbt` file in the cloned repo.
* Click `Open As Project`
* Click `Trust Project` (This may take a few minutes ~2m)

## Running all tests
You can run the tests for all the steps by running `src/test/scala/test/Test.scala`.

* Run them, and you should see 14 failing steps (since we haven't implemented any of them)

## Running specific step tests
You can run the tests for a specific step by editing the test configuration and setting `Program arguments` to be the `<step>`.

<img src="https://static.wixstatic.com/media/7c303e_dae05de3941e47759a690e94f8fbd4eb~mv2.png" width="250" alt=""/>

<img src="https://static.wixstatic.com/media/7c303e_daf12299c3094f3dab0b95f99157d614~mv2.png" width="350" alt=""/>

* Try it now on step 1 (`Program arguments: "1"`), and you should have one failing test `"should have answer for step 1"`.


**In order to solve a step you will need to enter a Regex in the appropriate answer value in `./src/main/scala/solution/Solution.scala`.**

Now that you are done you can begin with [step 1](https://github.com/nayish/regex-workshop#step-1---intro).
