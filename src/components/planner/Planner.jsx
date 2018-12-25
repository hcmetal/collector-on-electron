import React from "react";
import { Icon } from "antd";
import { collectorMachineInterface } from "../collector/Collector";
import styles from "./Planner.module.css";

const Planner = () => {
  const { items, expandedQuestKeys } = collectorMachineInterface.context;
  const { openItem, showWorkbench, expandQuest } = collectorMachineInterface;

  const quests =
    items.filter(item => {
      return item.type === "collection" && item.isQuest;
    }) || [];

  const currentDate = new Date();
  // Offset current date so today is in the middle of the row
  currentDate.setDate(currentDate.getDate() - 11);

  let dates = [];
  for (let i = 0; i < 21; i++) {
    currentDate.setDate(currentDate.getDate() + 1);

    dates = dates.concat({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    });
  }

  const questDateClass = (date, steps) => {
    const stepDates = steps.map(step => {
      const parseStepBeginDate = step.timeCreate.split("/");
      const parseStepEndDate = step.timeLastModify.split("/");
      return {
        beginDate: new Date(
          parseStepBeginDate[0],
          parseStepBeginDate[1] - 1,
          parseStepBeginDate[2]
        ),
        endDate: new Date(
          parseStepEndDate[0],
          parseStepEndDate[1] - 1,
          parseStepEndDate[2]
        )
      };
    });

    let questBeginDate = stepDates[0].beginDate;
    let questEndDate = stepDates[0].endDate;

    for (let stepDate of stepDates) {
      if (stepDate.beginDate < questBeginDate) {
        questBeginDate = stepDate.beginDate;
      }

      if (stepDate.endDate > questEndDate) {
        questEndDate = stepDate.endDate;
      }
    }

    const formattedDate = new Date(date.year, date.month - 1, date.day);

    if (formattedDate.getTime() === questBeginDate.getTime()) {
      return styles.calendarDateStart;
    } else if (questBeginDate < formattedDate && formattedDate < questEndDate) {
      return styles.calendarDateDuring;
    } else if (formattedDate.getTime() === questEndDate.getTime()) {
      return styles.calendarDateEnd;
    } else {
      return styles.calendarDateEmpty;
    }
  };

  const stepDateClass = (date, step) => {
    const parseStepBeginDate = step.timeCreate.split("/");
    const parseStepEndDate = step.timeLastModify.split("/");

    const stepBeginDate = new Date(
      parseStepBeginDate[0],
      parseStepBeginDate[1] - 1,
      parseStepBeginDate[2]
    );

    const stepEndDate = new Date(
      parseStepEndDate[0],
      parseStepEndDate[1] - 1,
      parseStepEndDate[2]
    );

    const formattedDate = new Date(date.year, date.month - 1, date.day);

    if (!step.discovered) {
      if (formattedDate.getTime() === stepBeginDate.getTime()) {
        return styles.calendarDateStart;
      } else if (stepBeginDate < formattedDate && formattedDate < stepEndDate) {
        return styles.calendarDateDuring;
      } else if (formattedDate.getTime() === stepEndDate.getTime()) {
        return styles.calendarDateEnd;
      } else {
        return styles.calendarDateEmpty;
      }
    } else {
      if (formattedDate.getTime() === stepBeginDate.getTime()) {
        return styles.calendarDateStartDiscovered;
      } else if (stepBeginDate < formattedDate && formattedDate < stepEndDate) {
        return styles.calendarDateDuringDiscovered;
      } else if (formattedDate.getTime() === stepEndDate.getTime()) {
        return styles.calendarDateEndDiscovered;
      } else {
        return styles.calendarDateEmptyDiscovered;
      }
    }
  };

  return (
    <div className={styles.expandedWrapper}>
      <div className={styles.wrapperQuest}>
        {quests.map(quest => {
          const steps = items.filter(item => {
            return (
              item.type === "treasure" && quest.treasureIDs.includes(item.id)
            );
          });

          return (
            <ul className={styles.questWrapper} key={quest.id}>
              <li className={styles.questTitleWrapper}>
                <div
                  className={styles.questIcon}
                  onClick={() => {
                    expandQuest(quest.id);
                  }}
                >
                  {expandedQuestKeys.includes(quest.id) ? (
                    <Icon type="down" theme={"outlined"} />
                  ) : (
                    <Icon type="right" theme={"outlined"} />
                  )}
                </div>
                <div
                  className={styles.questTitle}
                  onClick={() => {
                    showWorkbench();
                    openItem(quest.id);
                  }}
                >
                  {quest.title}
                </div>
                <div className={styles.calendarRow}>
                  {dates.map((date, index) => {
                    return (
                      <div className={questDateClass(date, steps)} key={index}>
                        <span>{date.day}</span>
                      </div>
                    );
                  })}
                </div>
              </li>
              {expandedQuestKeys.includes(quest.id) &&
                steps.map(step => {
                  return (
                    <li className={styles.stepWrapper} key={step.id}>
                      <div className={styles.stepIcon}>
                        {!step.discovered ? (
                          <Icon
                            type="question-circle"
                            theme={"outlined"}
                            style={{ color: "#f5222d" }}
                          />
                        ) : (
                          <Icon
                            type="question-circle"
                            theme={"outlined"}
                            style={{ color: "#f5222d", visibility: "hidden" }}
                          />
                        )}
                      </div>
                      <div
                        className={styles.stepTitle}
                        onClick={() => {
                          showWorkbench();
                          openItem(step.id);
                        }}
                      >
                        {step.title}
                      </div>
                      <div className={styles.calendarRowStep}>
                        {dates.map((date, index) => {
                          return (
                            <div
                              className={stepDateClass(date, step)}
                              key={index}
                            >
                              <span> </span>
                            </div>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default Planner;
