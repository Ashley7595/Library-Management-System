import React from 'react'
import '../Style/About.css'
import students from "../../assets/students.jpg"
import knowledge from "../../assets/knowledge.jpg"
import learners from "../../assets/learners.jpg"
function About() {
    return (
        <>
            <div className='aboutpage container mt-5 mb-5'>
                <div className='col-lg-12'>
                    <div className='row'>
                        <div className='about'>
                            <h2 className='commonTitle text-center'>About Smart Library</h2>
                            <h5 className='subTitle text-center pb-3'>Empowering Libraries Through Smart Technology</h5>
                            <p className='landingPara'>Welcome to SmartLibrary, your trusted partner in modern library management.
                                We believe that libraries are not just about books—they're about access to knowledge,
                                seamless organization, and an exceptional user experience.

                                Whether you're running a school, college, public library, or a private collection,
                                SmartLibrary is designed to simplify how you manage resources, track user activity,
                                and automate routine tasks—so you can focus on what really matters: your readers.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='about1 col-lg-12 pt-5'>
                    <div className='row gx-4'>
                        <div className='col-lg-4'>
                            <div className='gridItem p-4'>
                                <img src={students} className='gridImg'/>
                                <div className='gridDetails'>
                                    <h4 className='subHeading'>Empowering Student Success</h4>
                                    <p className='gridAbout'>
                                        Our library is more than just a building full of books;
                                        it's a vital hub for academic achievement and personal growth.
                                        We understand the unique needs of students and are committed to
                                        providing resources that support every step of your educational journey.
                                        Our dedicated staff is always on
                                        hand to assist with research, navigate databases, and help you
                                        unlock the information you need to succeed in your courses and beyond.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className='gridItem p-4'>
                                <img src={knowledge} className='gridImg' />
                                <div className='gridDetails'>
                                    <h4 className='subHeading'>Unlock a World of Knowledge</h4>
                                    <p className='gridAbout'>Reading is the foundation of learning, and our library offers an
                                        unparalleled gateway to knowledge. Beyond textbooks, we provide
                                        access to a vast array of genres, subjects, and formats, including
                                        e-books, audiobooks, and academic journals. Delve into historical
                                        accounts, explore scientific breakthroughs, or immerse yourself in
                                        classic literature. Each book and resource is an opportunity to broaden
                                        your horizons, deepen your understanding.</p>
                                </div>
                            </div>
                        </div> 
                        
                        <div className='col-lg-4'>
                            <div className='gridItem p-4'>
                                <img src={learners} className='gridImg' />
                                <div className='gridDetails'>
                                    <h4 className='subHeading'>A Community Hub for Learners</h4>
                                    <p className='gridAbout'>Our library is a dynamic space designed to foster a vibrant learning
                                        community. Whether you're looking
                                        for peer support, seeking to develop new skills, or simply need a quiet
                                        place to unwind with a good book, you'll find a welcoming environment here.
                                        We believe in nurturing a love for learning that lasts a lifetime, and we're proud
                                        to be a place where curiosity is celebrated and intellectual exploration is
                                        encouraged for every student.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About