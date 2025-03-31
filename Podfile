platform :ios, '14.0'

require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/expo/scripts/autolinking'

target 'HomeSnapPro' do
  use_expo_modules!
  config = use_native_modules!
  use_react_native!(:path => config[:reactNativePath])

  post_install do |installer|
    react_native_post_install(installer)

    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '14.0'
      end
    end
  end
end
