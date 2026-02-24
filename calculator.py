"""Simple command-line calculator for two numbers."""


def calculate(a: float, b: float) -> dict[str, float | str]:
    """Return results of basic arithmetic operations on two numbers."""
    return {
        "addition": a + b,
        "subtraction": a - b,
        "multiplication": a * b,
        "division": "undefined (division by zero)" if b == 0 else a / b,
    }


def main() -> None:
    """Prompt for two numbers and print arithmetic results."""
    try:
        first_number = float(input("Enter the first number: "))
        second_number = float(input("Enter the second number: "))
    except ValueError:
        print("Invalid input. Please enter numeric values.")
        return

    results = calculate(first_number, second_number)

    print(f"\nAddition: {results['addition']}")
    print(f"Subtraction: {results['subtraction']}")
    print(f"Multiplication: {results['multiplication']}")
    print(f"Division: {results['division']}")


if __name__ == "__main__":
    main()
