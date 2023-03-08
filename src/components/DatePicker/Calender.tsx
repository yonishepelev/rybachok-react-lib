import React, { useCallback, useEffect } from "react";
import { useMemo, useState } from "react";
import { format, isSameDay, startOfMonth } from "date-fns";
import LeftArrow from "./left-arrow-svgrepo-com.svg";
import RightArrow from "./right-arrow-svgrepo-com.svg";

interface CalenderProps {
  width?: string;
  height?: string;
  selectedDate: Date;
  onDateClick: (newDate: Date) => void;
  zIndex?: number;
}
type weekArrayType = [number, number, number];
type dateGridType = weekArrayType[][];
type showDateGridType = "DATE_GRID" | "MONTHS_GRID" | "YEARS_GRID";

//todo Добавить подсветку выходных и праздничных дней через получение информации с сайта http://xmlcalendar.ru/
const showDateGrid = "DATE_GRID";
const showMonthsGrid = "MONTHS_GRID";
const showYearsGrid = "YEARS_GRID";
import css from "./main.module.css";

export const Calender = ({
  width,
  height,
  selectedDate,
  onDateClick,
  zIndex = 1,
}: CalenderProps) => {
  const [gDate, setGDate] = useState(new Date(selectedDate));
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [dateGrid, setDateGrid] = useState<dateGridType | []>([]);
  const [showingGrid, setShowingGrid] =
    useState<showDateGridType>(showDateGrid);
  const [yearGrid, setYearGrid] = useState<number[] | []>([]);
  const selectedDateString = useMemo(() => {
    if (selectedDate) return format(selectedDate, "yyyy.M.d");
    else return format(new Date(), "yyyy.M.d");
  }, [selectedDate]);
  const header = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];
  const generateYearGrid = (date: Date): number[] => {
    const r = [];
    for (let y = date.getFullYear() - 5; y <= date.getFullYear() + 6; y++) {
      r.push(y);
    }
    return r;
  };

  const createGrid = (date: Date): dateGridType | [] => {
    const mDate = startOfMonth(date);
    const dayWeekIndex = mDate.getDay() === 0 ? 6 : mDate.getDay() - 1;
    const result = [];

    mDate.setDate(mDate.getDate() - dayWeekIndex);
    let weekCounter = 1;
    while (weekCounter <= 6) {
      let dayCounter = 1;
      let week = [];
      while (dayCounter <= 7) {
        const weekArray = [
          mDate.getFullYear(),
          mDate.getMonth(),
          mDate.getDate(),
        ] as weekArrayType;
        week.push(weekArray);
        mDate.setDate(mDate.getDate() + 1);
        dayCounter++;
      }
      result.push(week);
      weekCounter++;
    }
    return result;
  };

  const updateCalender = useCallback((date: Date) => {
    setGDate(date);
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth());
    setDateGrid(createGrid(date));
    setYearGrid(generateYearGrid(date));
  }, []);
  useEffect(() => {
    updateCalender(selectedDate);
  }, [selectedDate, updateCalender]);

  const moveMonth = (move: 1 | -1) => {
    const date = new Date(gDate);
    date.setMonth(date.getMonth() + move);
    console.log(date);

    updateCalender(date);
  };

  return (
    <div
      style={{
        width,
        height,
        zIndex,
      }}
      className={css.calenderContainer}
    >
      <div
        style={{
          display: showingGrid === showDateGrid ? "" : "none",
        }}
        className={css.calendarHeader}
      >
        <button
          onClick={() => {
            moveMonth(-1);
          }}
          className={css.arrow_button + " " + css.arrow_button_left}
        >
          <div title="Предыдущий месяц">
            <LeftArrow />
          </div>
        </button>
        <button
          onClick={() => {
            moveMonth(1);
          }}
          className={css.arrow_button + " " + css.arrow_button_right}
        >
          <div title="Следующий месяц">
            <RightArrow />
          </div>
        </button>
        <div className={css.monthButton}>
          <button
            onClick={() => {
              setShowingGrid(showMonthsGrid);
            }}
            className={css.selectMonth}
          >
            {months[selectedMonth]}
          </button>
          <button
            onClick={() => {
              setShowingGrid(showYearsGrid);
            }}
            className={css.selectYear}
          >
            {selectedYear}
          </button>
        </div>
      </div>
      {showingGrid === showDateGrid && (
        <div className={css.grid}>
          {header.map((d, index) => {
            return <div key={index}>{d}</div>;
          })}
        </div>
      )}
      {showingGrid === showDateGrid &&
        dateGrid.length > 0 &&
        dateGrid.map((weekArray, index) => {
          return (
            <div className={css.grid} key={index}>
              {weekArray.map((dateArray) => {
                const [year, month, day] = dateArray;
                const dt = new Date(...dateArray);

                let cssMonth = css.dateCalender;
                if (
                  selectedDateString === [year, month + 1, day].join(".") &&
                  month === gDate.getMonth()
                )
                  cssMonth += " " + css.selectedDate;
                if (isSameDay(dt, new Date()))
                  cssMonth += " " + css.currentDate;
                if (index === 0 && day > 7) {
                  cssMonth += " " + css.cssPrevMonth;
                }
                if (index > 3 && day <= 14) {
                  cssMonth += " " + css.cssPrevMonth;
                }
                return (
                  <div
                    onClick={() => {
                      onDateClick(dt);
                    }}
                    className={cssMonth}
                    key={day}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          );
        })}
      <div
        style={{
          display: showingGrid === showMonthsGrid ? "" : "none",
        }}
        className={css.monthsGrid}
      >
        {months.map((monthName, monthIndex) => {
          return (
            <div
              onClick={() => {
                gDate.setMonth(monthIndex);

                updateCalender(gDate);
                setShowingGrid(showDateGrid);
              }}
              key={monthIndex}
            >
              <span>{monthName}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: showingGrid === showYearsGrid ? "" : "none",
        }}
        className={css.yearsGrid}
      >
        <div
          onClick={() => {
            const nDate = new Date(gDate);

            nDate.setFullYear(gDate.getFullYear() - 12);
            setYearGrid(generateYearGrid(nDate));
            setGDate(() => nDate);
          }}
        >
          <div title="Предыдущие годы">
            <LeftArrow />
          </div>
        </div>
        {yearGrid &&
          yearGrid.map((year, yearIndex) => {
            return (
              <div
                className={css.yearG}
                onClick={() => {
                  const nDate = new Date(gDate);
                  nDate.setFullYear(year);
                  updateCalender(nDate);
                  setShowingGrid(showDateGrid);
                }}
                key={yearIndex}
              >
                <span>{year}</span>
              </div>
            );
          })}
        <div
          onClick={() => {
            const nDate = new Date(gDate);

            nDate.setFullYear(gDate.getFullYear() + 12);

            setYearGrid(generateYearGrid(nDate));
            setGDate(() => nDate);
          }}
        >
          <div title="Последующие годы">
            <RightArrow />
          </div>
        </div>
      </div>
    </div>
  );
};
