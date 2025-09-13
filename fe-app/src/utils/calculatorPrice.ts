import type { DateRange } from 'react-day-picker';

export interface CalculatorPriceParams {
    pricePerNight: number;
    date: DateRange | undefined;
}

export const calculatorPrice = ({
    pricePerNight,
    date,
}: CalculatorPriceParams) => {
    // Tính số đêm
    const nights =
        date?.from && date?.to
            ? Math.max(
                  1,
                  Math.ceil(
                      (date.to.getTime() - date.from.getTime()) /
                          (1000 * 60 * 60 * 24),
                  ),
              )
            : 1;

    // Tổng tiền
    const total = pricePerNight * nights;

    return {
        nights,
        total,
    };
};
