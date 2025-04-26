// Course Desc in this order:

import { useState } from "react";

// DAT-210, CSI-300, DAT-410
const courseDesriptions = [
    "Students will analyze data using Python programming language to obtain insights from real-world data sets. Students will access data files containing both numerical and categorical data, which they will prepare for analysis by data preprocessing, data wrangling, and data aggregation. Students will conduct statistical analysis, text analysis, and date/time series analysis, summarize their findings in a meaningful manner, and use visualization to illustrate patterns and trends in the data.",
    "This course will introduce students to database design, Structured Query Language (SQL), normalization, and relational database theory. Traditional relational databases will be contrasted with NoSQL paradigm databases including document-oriented, key-value store, and graph. Students will gain hands-on experience writing database applications.",
    "This course will introduce students to practical machine learning and its applications. It will cover both supervised and unsupervised clustering algorithms and their applications in business problems like market segmentation. Students will also become familiar with artificial neural networks and their use in prediction modeling. Software packages and tools related to machine learning algorithms will also be covered."
];

const DropDownText = ({ course }) => {
    const [isTextShown, setIsTextShown] = useState(false);

    const handleDropDown = () => {
        setIsTextShown(!isTextShown);
    }

    const getCourseDescription = () => {
        if(course.CoursePrefix == "DAT-210") {
            return courseDesriptions[0]
        }
        if(course.CoursePrefix == "CSI-300") {
            return courseDesriptions[1]
        }
        if(course.CoursePrefix == "DAT-410") {
            return courseDesriptions[2]
        }
    }

  return (
    <>
        <div className="dropDown_Container">
            <a onClick={handleDropDown} className="dropDown_button">{isTextShown ? "▲" : "▼"} Course Description</a>
            {isTextShown && (
                <p className="dropDown_text">
                    {getCourseDescription()}
                </p>
            )}
        </div>
    </>
  )
}

export default DropDownText;