import {Movie} from "./movie";
import {Rental} from "./rental";

export class Customer {

    private static getMovieAmont(movie: Rental): number {
        let thisAmount = 0;
        // determine amounts for movie line
        switch (movie.getMovie().getPriceCode()) {
            case Movie.REGULAR:
                thisAmount += 2;
                if (movie.getDaysRented() > 2) {
                    thisAmount += (movie.getDaysRented() - 2) * 1.5;
                }
                break;
            case Movie.NEW_RELEASE:
                thisAmount += movie.getDaysRented() * 3;
                break;
            case Movie.CHILDRENS:
                thisAmount += 1.5;
                if (movie.getDaysRented() > 3) {
                    thisAmount += (movie.getDaysRented() - 3) * 1.5;
                }
                break;
        }
        return thisAmount;
    }

    private readonly name: string;
    private rentals: Rental[] = [];

    public constructor(name: string) {
        this.name = name;
    }

    public addRental(arg: Rental) {
        this.rentals.push(arg);
    }

    public getName(): string {
        return this.name;
    }

    public statement(): string {
        let totalAmount = 0;
        let frequentRenterPoints = 0;
        let result = "Rental Record for " + this.getName() + "\n";
        const countMovies = this.countMovies(frequentRenterPoints, result, totalAmount);
        frequentRenterPoints = countMovies.frequentRenterPoints;
        result = countMovies.result;
        totalAmount = countMovies.totalAmount;

        // add footer lines
        result += "Amount owed is " + totalAmount.toFixed(1) + "\n";
        result += "You earned " + frequentRenterPoints + " frequent renter points";

        return result;
    }

    private countMovies(frequentRenterPoints: number, result: string, totalAmount: number) {
        for (const movie of this.rentals) {
            const thisAmount = Customer.getMovieAmont(movie);

            // add frequent renter points
            frequentRenterPoints++;
            // add bonus for a two day new release rental
            if ((movie.getMovie().getPriceCode() === Movie.NEW_RELEASE) && movie.getDaysRented() > 1) {
                frequentRenterPoints++;
            }

            // show figures for this rental
            result += "\t" + movie.getMovie().getTitle() + "\t" + thisAmount.toFixed(1) + "\n";
            totalAmount += thisAmount;
        }
        return {frequentRenterPoints, result, totalAmount};
    }
}
