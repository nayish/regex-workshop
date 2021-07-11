package test

import org.json4s._
import org.json4s.jackson.JsonMethods._
import solution.Solution

import scala.io.Source

case class Config(steps: Seq[StepConfig])
case class StepConfig(title: String, pass: Seq[String], fail: Seq[String])


object Test extends App {
  val steps = getSteps()

  val testsToRun: Seq[Int] = if (args.length > 0) Seq(args(0).toInt) else (1 to (steps.size)).toList

  var total = 0;
  var passed = 0;

  testsToRun.foreach{
    case (i) ⇒
      val step = steps(i - 1)

      println(s"Regex Step ${i}")
      val regex = getAnswerByStep(i).r

      if (regex.pattern.toString.isEmpty) {
        printTestResult(false, s"should have answer for step ${i} (define answer${i} in Solution.scala)")
      } else {
        step.pass.foreach((textShouldPass) ⇒ {
          val message = s"""should ${step.title} (${quote(textShouldPass)})"""
          val success = regex.findFirstIn(textShouldPass).isDefined
          printTestResult(success, message)
        })
        step.fail.foreach((textShouldPass) ⇒ {
          val message = s"""should not ${step.title} (${quote(textShouldPass)})"""
          val success = regex.findFirstIn(textShouldPass).isEmpty
          printTestResult(success, message)
        })
      }
  }

  println(Console.BOLD + s"\nTest Suites: " + (if (passed != total) Console.RED + s"1 failed" +Console.BLACK + ", " else Console.GREEN + s"1 passed"+ Console.RESET + ", ") + s"1 total")
  println(Console.BOLD + s"Tests:       " + (if (passed != total) Console.RED + s"${total-passed} failed" +Console.BLACK + ", " else "")+ (if (passed > 0) Console.GREEN + s"${passed} passed"+ Console.RESET + ", " else "") + s"${total} total")
  def printTestResult(success: Boolean, message: String): Unit = {
    total += 1
    if (success) {
      println(Console.GREEN + "  ✓ " + Console.RESET + message)
      passed += 1
    } else {
      println(Console.RED + Console.BOLD + "  ✗ " + message + Console.RESET)
    }
  }

  def quote (s: String): String = "\"" + escape(s) + "\""
  def escape(s: String): String = s.flatMap(escapedChar)

  def escapedChar(ch: Char): String = ch match {
    case '\b' => "\\b"
    case '\t' => "\\t"
    case '\n' => "\\n"
    case '\f' => "\\f"
    case '\r' => "\\r"
    case '"'  => "\\\""
    case '\'' => "\\\'"
    case '\\' => "\\\\"
    case _ => if (ch.isControl) "\\0" + Integer.toOctalString(ch.toInt)
    else String.valueOf(ch)
  }

  def getAnswerByStep(i: Int): String = {
    val field = Solution.getClass.getDeclaredField(s"answer$i")
    field.setAccessible(true)
    field.get().toString
  }

  def getSteps(): Seq[StepConfig] = {
    implicit val formats = DefaultFormats

    val inputFile = "./test-config.json"
    val source = Source.fromFile(inputFile)
    val json_content = source.mkString
    source.close()

    parse(json_content).extract[Config].steps
  }
}
