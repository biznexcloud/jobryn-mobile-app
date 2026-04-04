const fs = require('fs');

function fixFile(path, replacer) {
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        let newContent = replacer(content);
        if (content !== newContent) {
            fs.writeFileSync(path, newContent);
            console.log('Fixed', path);
        }
    }
}

// 1. Fix react-native-heroicons
const screens = [
  'src/screens/jobProvider/AnalyticsScreen.tsx',
  'src/screens/jobProvider/ApplicantDetailScreen.tsx',
  'src/screens/jobProvider/BillingScreen.tsx',
  'src/screens/jobProvider/ProviderAboutInfoScreen.tsx',
  'src/screens/jobProvider/ProviderProfileScreen.tsx',
  'src/screens/jobProvider/SettingsScreen.tsx'
];

screens.forEach(file => {
    fixFile(file, content => {
        return content.replace(/import\s*\{([\s\S]*?)\}\s*from\s*'react-native-heroicons\/(outline|solid)';/, (match, p1) => {
            let inner = p1.replace(/([A-Za-z0-9]+)Icon/g, (m, icon) => {
                if (icon === 'Cog6Tooth') return 'Settings as Cog6ToothIcon';
                if (icon === 'TrendingUp') return 'TrendingUp as TrendingUpIcon';
                if (icon === 'XCircle') return 'XCircle as XCircleIcon';
                if (icon === 'ArrowPath') return 'RefreshCw as ArrowPathIcon';
                if (icon === 'LockClosed') return 'Lock as LockClosedIcon';
                if (icon === 'Pencil') return 'Edit2 as PencilIcon';
                if (icon === 'ChevronRight') return 'ChevronRight as ChevronRightIcon';
                if (icon === 'ShieldCheck') return 'ShieldCheck as ShieldCheckIcon';
                if (icon === 'ArrowRightOnRectangle') return 'LogOut as ArrowRightOnRectangleIcon';
                if (icon === 'Key') return 'Key as KeyIcon';
                return `${icon} as ${icon}Icon`;
            });
            // also clean up React native heroicons specific things if they used weird names
            return `import {${inner}} from 'lucide-react-native';`;
        });
    });
});

// 2. Fix ApplicantDetailScreen import ApplicationStatus
fixFile('src/screens/jobProvider/ApplicantDetailScreen.tsx', content => {
    return content.replace(/import \{ ApplicationStatus \} from '.\/ApplicantsScreen';/, "import { ApplicationStatus } from '../../screens/jobProvider/ApplicantsScreen';")
                  .replace(/import \{ ApplicationStatus \} from '\.\.\/ApplicantsScreen';/, "import { ApplicationStatus } from '../../screens/jobProvider/ApplicantsScreen';");
});

// 3. Fix SignupScreen register
fixFile('src/screens/auth/SignupScreen.tsx', content => {
    return content.replace(/AuthService\.signup\(/, 'AuthService.register(');
});

// 4. Fix AppliedJobsScreen API
fixFile('src/screens/jobSeeker/AppliedJobsScreen.tsx', content => {
    return content.replace(/getAppliedJobs\(/, 'getRecruiterApplications(');
});

// 5. Fix SavedItemsScreen API
fixFile('src/screens/jobSeeker/SavedItemsScreen.tsx', content => {
    return content.replace(/getSavedJobs\(/, 'getJobs('); // Assuming getJobs is equivalent
});

console.log('Script executed.');
