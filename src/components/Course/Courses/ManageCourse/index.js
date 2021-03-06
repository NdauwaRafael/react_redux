/**
 * Created by Raphael Karanja on 2019-01-25.
 */
import React, {Component} from 'react';
import * as courseActions from '../../../../CourseAppStore/actions/CourseActions';
import {bindActionCreators} from "redux";
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import {alert, confirm} from "notie";
import AddCourse from './CourseForm'

class ManageCourses extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            course: Object.assign({}, this.props.course),
            errors: {},
            saving: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.onSave = this.onSave.bind(this);
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.course.id !== nextProps.course.id) {
            this.setState({
                course: Object.assign({}, nextProps.course)
            })
        }
    }

    handleChange(event) {
        let field = event.target.name;
        let value = event.target.value;
        let course = Object.assign({}, this.state.course);
        course[field] = value;
        return this.setState({course});
    };

    courseIsValid() {
        let {course, errors} = this.state;
        let isValid = true;

        if (course.title.length <= 3) {
            errors.title = 'Course title must be at least 3 characters';
            isValid = false;
        } else {
            errors.title = ''
        }

        if (course.authorId.length === 0) {
            errors.authorId = 'Author is required';
            isValid = false;
        } else {
            errors.authorId = ''
        }

        if (course.categoryId.length === 0) {
            errors.categoryId = 'Please select a category';
            isValid = false;
        } else {
            errors.categoryId = ''
        }

        if (course.description.length <= 20) {
            errors.description = 'Description is too short. Provide at least 20 characters';
            isValid = false;
        } else {
            errors.description = ''
        }


        this.setState({errors});

        return isValid;

    };


    onSave(e) {
        e.preventDefault();
        if (!this.courseIsValid()){
            return;
        }
        const {course} = this.state;


        confirm({
            text: 'Are you sure you want to do that?<br><b>That\'s a bold move...</b>',
            cancelCallback: () => {
                alert({type: 3, text: 'Aw, why not? :(', time: 2})
            },
            submitCallback: () => {
                this.setState({saving: true});
                this.props.actions.createCourse(course)
                    .then(()=>{
                        this.props.history.push('/courses');
                        this.setState({saving: false});
                        alert({type: 'success', text: 'Success, Course was added successfully :)', time: 2})
                    })
                    .catch(()=>{
                        alert({type: 3, text: 'Could not save :(', time: 2});
                        this.setState({saving: false});
                    })

            }
        })
    };

    render() {
        const {authors, categories} = this.props;
        const {course, errors, saving} = this.state;
        return (
            <div className="max-w-lg w-full">
                <div
                    className="border-r border-b border-l border-grey-light lg:border-t lg:border-grey-light bg-white rounded-b lg:rounded-l lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-8">
                        <p className="text-sm text-grey-dark flex items-center mb-8">
                            <svg className="fill-current text-grey w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path
                                    d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"/>
                            </svg>
                            Manage Authors Page
                        </p>
                        <AddCourse onChange={this.handleChange}
                                   course={course}
                                   allAuthors={authors}
                                   categories={categories}
                                   loading={saving}
                                   onSave={this.onSave}
                                   errors={errors}/>
                    </div>
                </div>
            </div>
        );
    }
}

ManageCourses.propTypes = {
    // course: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
};

const getCourseById = (courses, id) => {
    let course = courses.filter(course => parseInt(course.id) === parseInt(id));
    if (course.length > 0){
        return course[0]
    }
    return null
};

const mapStateToProps = (state, ownProps) => {
    let course = {id: '', watched: '', title: '', authorId: '', description: '', categoryId: ''};
    let courseId = ownProps.match.params.id;

    if (courseId && state.courses.length > 0) {
        course = getCourseById(state.courses, courseId);
    }


    const authorFormattedForDropdown = state.authors.map(author => {
        return {
            value: author.id,
            text: author.name
        };
    });

    const categoriesFormattedForDropdown = state.categories.map(category => {
        return {
            value: category.id,
            text: category.name
        };
    });
    return {
        course: course,
        authors: authorFormattedForDropdown,
        categories: categoriesFormattedForDropdown
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(courseActions, dispatch)
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageCourses)