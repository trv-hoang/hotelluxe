import React from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Hotel,
    Users,
    Globe,
    Heart,
    Star,
    Award,
    Shield,
    Clock,
    Mail,
    Phone,
    Linkedin,
    Github,
} from 'lucide-react';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

// Team members data
const teamMembers = [
    {
        id: 1,
        name: 'Ngô Đăng Tân',
        role: 'CEO & Founder',
        description:
            'Chuyên gia trong lĩnh vực khách sạn với hơn 15 năm kinh nghiệm quản lý và phát triển thương hiệu.',
        avatar: '/public/avatar.png',
        email: 'tan.ngo@hotelluxe.com',
        phone: '+84 901 234 567',
        linkedin: 'linkedin.com/in/ngodangtanh',
        skills: ['Leadership', 'Strategy', 'Hospitality Management'],
    },
    {
        id: 2,
        name: 'Trần Việt Hoàng',
        role: 'CTO & Tech Lead',
        description:
            'Kỹ sư phần mềm senior với chuyên môn về hệ thống quản lý khách sạn và công nghệ số.',
        avatar: '/public/avatar.png',
        email: 'hoang.tran@hotelluxe.com',
        phone: '+84 902 345 678',
        github: 'github.com/tranviethoang',
        skills: ['Full-stack Development', 'System Architecture', 'DevOps'],
    },
    {
        id: 3,
        name: 'Nguyễn Đình Đông Kha',
        role: 'Head of Operations',
        description:
            'Chuyên gia vận hành với kinh nghiệm sâu rộng trong việc tối ưu hóa quy trình và dịch vụ khách hàng.',
        avatar: '/public/kha.png',
        email: 'kha.nguyen@hotelluxe.com',
        phone: '+84 903 456 789',
        linkedin: 'linkedin.com/in/nguyendinhdongkha',
        skills: [
            'Operations Management',
            'Customer Service',
            'Process Optimization',
        ],
    },
    {
        id: 4,
        name: 'Phạm Mỹ Linh',
        role: 'Head of Marketing',
        description:
            'Chuyên gia marketing số với niềm đam mê tạo ra những chiến dịch sáng tạo và hiệu quả.',
        avatar: '/public/avatar.png',
        email: 'linh.pham@hotelluxe.com',
        phone: '+84 904 567 890',
        linkedin: 'linkedin.com/in/phammylinh',
        skills: ['Digital Marketing', 'Brand Management', 'Content Strategy'],
    },
    {
        id: 5,
        name: 'Nguyễn Như Uyên',
        role: 'Head of Customer Experience',
        description:
            'Chuyên gia trải nghiệm khách hàng với sứ mệnh mang lại sự hài lòng tuyệt đối cho mọi khách hàng.',
        avatar: '/public/avatar.png',
        email: 'uyen.nguyen@hotelluxe.com',
        phone: '+84 905 678 901',
        linkedin: 'linkedin.com/in/nguyennhuuyen',
        skills: ['Customer Experience', 'Service Design', 'Quality Assurance'],
    },
];

// Services data
const services = [
    {
        icon: Hotel,
        title: 'Đặt Phòng Trực Tuyến',
        description:
            'Hệ thống đặt phòng thông minh với giao diện thân thiện và quy trình đơn giản',
    },
    {
        icon: Users,
        title: 'Quản Lý Khách Hàng',
        description:
            'Hệ thống CRM toàn diện giúp theo dõi và chăm sóc khách hàng một cách tốt nhất',
    },
    {
        icon: Shield,
        title: 'Bảo Mật Tuyệt Đối',
        description:
            'Công nghệ bảo mật tiên tiến đảm bảo an toàn thông tin và giao dịch',
    },
    {
        icon: Clock,
        title: 'Hỗ Trợ 24/7',
        description:
            'Đội ngũ hỗ trợ khách hàng luôn sẵn sàng phục vụ mọi lúc, mọi nơi',
    },
];

const AboutPage: React.FC = () => {
    return (
        <div className='min-h-screen max-w-7xl flex items-center mx-auto bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
            <motion.div
                className='container mx-auto px-4 py-16'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
            >
                {/* Hero Section */}
                <motion.div
                    className='text-center mb-20'
                    variants={itemVariants}
                >
                    <motion.h1
                        className='text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6'
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        Hotel Luxe
                    </motion.h1>
                    <motion.p
                        className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed'
                        variants={itemVariants}
                    >
                        Nền tảng quản lý khách sạn hiện đại, mang đến trải
                        nghiệm tuyệt vời cho cả khách hàng và nhà quản lý
                    </motion.p>
                </motion.div>

                {/* Mission Section */}
                <motion.section className='mb-20' variants={itemVariants}>
                    <Card className='bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl'>
                        <CardHeader className='text-center pb-8'>
                            <motion.div
                                className='flex justify-center mb-4'
                                whileHover={{
                                    rotate: [0, 10, -10, 10, -10, 0],
                                    scale: 1.1,
                                }}
                                transition={{ duration: 0.8 }}
                            >
                                <Heart className='w-16 h-16 text-red-500' />
                            </motion.div>
                            <CardTitle className='text-3xl font-bold text-gray-800 dark:text-white'>
                                Sứ Mệnh Của Chúng Tôi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='text-center'>
                            <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto'>
                                Chúng tôi cam kết xây dựng một nền tảng công
                                nghệ tiên tiến nhất trong lĩnh vực khách sạn,
                                giúp các khách sạn tối ưu hóa hoạt động kinh
                                doanh và mang lại trải nghiệm đặc biệt cho khách
                                hàng. Với sự kết hợp hoàn hảo giữa công nghệ
                                hiện đại và dịch vụ nhân văn, chúng tôi hướng
                                tới mục tiêu trở thành đối tác tin cậy của mọi
                                khách sạn trên toàn thế giới.
                            </p>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* Services Section */}
                <motion.section className='mb-20' variants={itemVariants}>
                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
                            Hoạt Động & Dịch Vụ
                        </h2>
                        <p className='text-lg text-gray-600 dark:text-gray-300'>
                            Chúng tôi cung cấp giải pháp toàn diện cho ngành
                            khách sạn
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{
                                    duration: 0.2,
                                    delay: index * 0.1,
                                }}
                                className='group'
                            >
                                <Card className='h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl group-hover:shadow-2xl transition-all duration-300'>
                                    <CardHeader className='text-center'>
                                        <motion.div
                                            className='flex justify-center mb-4'
                                            whileHover={{
                                                scale: 1.2,
                                                rotate: 5,
                                            }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <service.icon className='w-12 h-12 text-blue-600' />
                                        </motion.div>
                                        <CardTitle className='text-xl font-semibold text-gray-800 dark:text-white'>
                                            {service.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-gray-600 dark:text-gray-300 text-center'>
                                            {service.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Team Section */}
                <motion.section className='mb-20' variants={itemVariants}>
                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
                            Đội Ngũ Của Chúng Tôi
                        </h2>
                        <p className='text-lg text-gray-600 dark:text-gray-300'>
                            Những con người tài năng và đam mê tạo nên Hotel
                            Luxe
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                transition={{
                                    duration: 0.2,
                                    delay: index * 0.1,
                                }}
                                className='group'
                            >
                                <Card className='h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl group-hover:shadow-2xl transition-all duration-300'>
                                    <CardHeader className='text-center'>
                                        <motion.div
                                            className='relative mx-auto mb-4'
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className='w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1'>
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className='w-full h-full rounded-full object-cover bg-white'
                                                />
                                            </div>
                                            <motion.div
                                                className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center'
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: 'linear',
                                                }}
                                            >
                                                <Star className='w-4 h-4 text-white' />
                                            </motion.div>
                                        </motion.div>
                                        <CardTitle className='text-xl font-bold text-gray-800 dark:text-white'>
                                            {member.name}
                                        </CardTitle>
                                        <CardDescription className='text-blue-600 font-semibold'>
                                            {member.role}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className='text-gray-600 dark:text-gray-300 text-center mb-6'>
                                            {member.description}
                                        </p>

                                        <div className='mb-4'>
                                            <h4 className='font-semibold text-gray-800 dark:text-white mb-2'>
                                                Chuyên môn:
                                            </h4>
                                            <div className='flex flex-wrap gap-2'>
                                                {member.skills.map(
                                                    (skill, skillIndex) => (
                                                        <motion.span
                                                            key={skillIndex}
                                                            className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm'
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                            }}
                                                        >
                                                            {skill}
                                                        </motion.span>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <Separator className='my-4' />

                                        <div className='space-y-2'>
                                            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                <Mail className='w-4 h-4 mr-2' />
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className='hover:text-blue-600 transition-colors'
                                                >
                                                    {member.email}
                                                </a>
                                            </div>
                                            <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                <Phone className='w-4 h-4 mr-2' />
                                                <a
                                                    href={`tel:${member.phone}`}
                                                    className='hover:text-blue-600 transition-colors'
                                                >
                                                    {member.phone}
                                                </a>
                                            </div>
                                            {member.linkedin && (
                                                <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                    <Linkedin className='w-4 h-4 mr-2' />
                                                    <a
                                                        href={`https://${member.linkedin}`}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='hover:text-blue-600 transition-colors'
                                                    >
                                                        LinkedIn
                                                    </a>
                                                </div>
                                            )}
                                            {member.github && (
                                                <div className='flex items-center text-sm text-gray-600 dark:text-gray-300'>
                                                    <Github className='w-4 h-4 mr-2' />
                                                    <a
                                                        href={`https://${member.github}`}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='hover:text-blue-600 transition-colors'
                                                    >
                                                        GitHub
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Values Section */}
                <motion.section className='mb-20' variants={itemVariants}>
                    <div className='text-center mb-12'>
                        <h2 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
                            Giá Trị Cốt Lõi
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='transform transition-transform duration-300 hover:scale-105'>
                            <Card className='text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl'>
                                <CardHeader>
                                    <Award className='w-12 h-12 mx-auto mb-4' />
                                    <CardTitle>Chất Lượng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Cam kết mang đến sản phẩm và dịch vụ
                                        chất lượng cao nhất
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className='transform transition-transform duration-300 hover:scale-105'>
                            <Card className='text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl'>
                                <CardHeader>
                                    <Users className='w-12 h-12 mx-auto mb-4' />
                                    <CardTitle>Khách Hàng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Đặt lợi ích và trải nghiệm khách hàng
                                        lên hàng đầu trong mọi quyết định
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className='transform transition-transform duration-300 hover:scale-105'>
                            <Card className='text-center bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl'>
                                <CardHeader>
                                    <Globe className='w-12 h-12 mx-auto mb-4' />
                                    <CardTitle>Đổi Mới</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>
                                        Không ngừng cải tiến và áp dụng công
                                        nghệ tiên tiến nhất
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.section>

                {/* Contact CTA */}
            </motion.div>
        </div>
    );
};

export default AboutPage;
